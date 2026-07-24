// Shared bounds, SAFE YAML parsing, and GitLab-CI-pipeline-semantic
// extraction helpers for the gitlab-ci-tools nodes. Not a node and not a
// test file, so it is neither registered nor collected by jest.
//
// The parse layer is entirely owned by js-yaml (js-yaml.github.io) —
// nothing here reimplements YAML parsing. What lives here is: (a) an
// input-size bound enforced BEFORE js-yaml ever sees the input, (b) a
// single-document safe parse, and (c) the GitLab CI pipeline-schema
// knowledge (which top-level key is reserved vs a job, what a job's
// `needs:`/`rules:`/`cache:`/`extends:` etc. actually mean) — that
// knowledge is this package's actual value-add, not something any generic
// YAML library provides.
//
// SAFETY: js-yaml v5's `load()` uses CORE_SCHEMA by default, which
// resolves only plain YAML scalars/sequences/mappings (strings, numbers,
// bools, null, arrays, objects) — there is no `!!js/function`,
// `!!js/regexp`, or any other tag capable of constructing an arbitrary JS
// object or executing code. That capability does not exist anywhere in
// js-yaml's codebase (fully removed, not merely opt-in, since v4) unless a
// caller explicitly installs the separate `js-yaml-js-types` package,
// which this package does not depend on. We additionally pass explicit
// `maxDepth`/`maxAliases` bounds on every parse call as defense-in-depth
// against deeply-nested or alias-amplified input, on top of this module's
// own byte-size ceiling.

import * as yaml from 'js-yaml';

/** js-yaml's own collection-nesting-depth bound (does not count aliases).
 * Real pipeline files rarely nest more than ~10 levels; 100 is generous
 * headroom while still bounding pathological input. */
export const MAX_YAML_DEPTH = 100;

/** js-yaml's own per-document alias-node ceiling — bounds "billion
 * laughs"-style alias amplification. Real pipeline files occasionally use
 * YAML anchors/aliases (a common trick for hidden-job templates); 200 is
 * generous headroom for legitimate use while bounding pathological
 * expansion. */
export const MAX_YAML_ALIASES = 200;

/** Defensive bound on how many hops an extends: chain may walk before
 * ResolveExtends gives up and reports an error, independent of cycle
 * detection (belt-and-braces against a very long, non-cyclic chain). */
export const MAX_EXTENDS_DEPTH = 50;

// Kept as a distinct Error subclass so every node's catch block can still
// narrow on it (currently unreachable — no bound in this file throws it —
// but it stays part of the public error-handling contract call sites rely
// on).
export class BoundsError extends Error {}

/** Turns a caught value into a stable error message. */
export function errorMessage(e: unknown, context: string): string {
  if (e instanceof Error) {
    return `${context}: ${e.message}`;
  }
  return `${context}: ${String(e)}`;
}

// ---------------------------------------------------------------------------
// Safe single-document parse
// ---------------------------------------------------------------------------

export interface ParsedPipeline {
  data: unknown;
  /** Non-null exactly when data is undefined. */
  parseError: string | null;
}

/** Safely parses one pipeline file's raw YAML text. A `.gitlab-ci.yml`
 * file is a SINGLE YAML document; a multi-document input (or any other
 * YAML problem) is reported as a parse error rather than silently taking
 * the first document. Never throws for a parse problem (captured in
 * parseError). */
export function parsePipelineYaml(text: string): ParsedPipeline {
  try {
    const data = yaml.load(text, {
      maxDepth: MAX_YAML_DEPTH,
      maxAliases: MAX_YAML_ALIASES,
    });
    return { data, parseError: null };
  } catch (e) {
    return { data: undefined, parseError: errorMessage(e, 'YAML parse error') };
  }
}

// ---------------------------------------------------------------------------
// Generic shape helpers
// ---------------------------------------------------------------------------

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function asString(v: unknown): string {
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return '';
}

export function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

/** Normalizes a field GitLab CI accepts as either a single string or a
 * list of strings (script, before_script, tags, extends, changes, exists,
 * ...) into a string array. Non-string list entries are stringified
 * defensively; undefined/null yields an empty array. */
export function asStringList(v: unknown): string[] {
  if (v === undefined || v === null) return [];
  if (Array.isArray(v)) return v.map(asString).filter((s) => s !== '');
  const s = asString(v);
  return s === '' ? [] : [s];
}

export function asBool(v: unknown): boolean {
  return v === true;
}

export function getIn(obj: unknown, path: string[]): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (!isPlainObject(cur)) return undefined;
    cur = cur[key];
  }
  return cur;
}

export interface KV {
  key: string;
  value: string;
}

/** Converts a plain map[string]<scalar>-shaped YAML mapping to KV pairs,
 * sorted by key for a deterministic, order-independent result. Non-string
 * scalar values are stringified (GitLab CI itself coerces e.g. an
 * unquoted numeric variable value to a string). */
export function mapToSortedKVs(m: unknown): KV[] {
  if (!isPlainObject(m)) return [];
  return Object.keys(m)
    .sort()
    .map((key) => ({ key, value: asString(m[key]) }));
}

/** True when the pipeline document is at least a mapping — the minimum
 * shape needed to look for jobs/stages at all. */
export function looksLikePipeline(data: unknown): boolean {
  return isPlainObject(data);
}

// ---------------------------------------------------------------------------
// Reserved top-level keywords vs. jobs
// ---------------------------------------------------------------------------

/** Top-level keys in a .gitlab-ci.yml document that are NEVER job
 * definitions — GitLab's own "unavailable names for jobs" list
 * (https://docs.gitlab.com/ee/ci/yaml/#unavailable-names-for-jobs), plus
 * `spec` (the CI/CD-components pipeline header) and the YAML-reserved
 * scalars true/false/nil (which, if used as an unquoted top-level mapping
 * key, resolve to those literal keys once stringified as an object
 * property). A common parsing bug is treating these as job entries; they
 * never are. */
export const RESERVED_TOP_LEVEL_KEYS: ReadonlySet<string> = new Set([
  'image',
  'services',
  'stages',
  'types', // deprecated alias of `stages`
  'before_script',
  'after_script',
  'variables',
  'cache',
  'include',
  'default',
  'workflow',
  'spec',
  'true',
  'false',
  'nil',
]);

/** Returns [job_id, rawJobObject] for EVERY key in the document that is
 * not a reserved top-level keyword and whose value is a plain mapping —
 * this includes hidden/template jobs (names starting with "."). Use
 * listRealJobEntries for the "real, scheduled jobs only" view. */
export function listAllJobEntries(data: Record<string, unknown>): Array<[string, Record<string, unknown>]> {
  const out: Array<[string, Record<string, unknown>]> = [];
  for (const key of Object.keys(data)) {
    if (RESERVED_TOP_LEVEL_KEYS.has(key)) continue;
    const job = data[key];
    if (isPlainObject(job)) out.push([key, job]);
  }
  return out;
}

/** True for a hidden/template job key (starts with "."). GitLab never
 * schedules these as real jobs — they exist to be pulled in via
 * `extends:`. */
export function isHiddenJobId(jobId: string): boolean {
  return jobId.startsWith('.');
}

/** Returns [job_id, rawJobObject] for every REAL (non-hidden, actually
 * scheduled) job, in document order. */
export function listRealJobEntries(data: Record<string, unknown>): Array<[string, Record<string, unknown>]> {
  return listAllJobEntries(data).filter(([id]) => !isHiddenJobId(id));
}

/** Looks up ANY job-shaped entry by id — real or hidden/template. Needed
 * by ResolveExtends/GetJobConfig, since `extends:` targets are very
 * commonly hidden jobs. */
export function findJobEntry(data: Record<string, unknown>, jobId: string): Record<string, unknown> | undefined {
  if (RESERVED_TOP_LEVEL_KEYS.has(jobId)) return undefined;
  const job = data[jobId];
  return isPlainObject(job) ? job : undefined;
}

// ---------------------------------------------------------------------------
// stages:
// ---------------------------------------------------------------------------

export const DEFAULT_USER_STAGES: readonly string[] = ['build', 'test', 'deploy'];

/** Computes the pipeline's effective stage order: the declared `stages:`
 * list (or GitLab's default ["build","test","deploy"] when absent),
 * always with ".pre" forced to the front and ".post" forced to the back —
 * GitLab documents .pre/.post as ALWAYS present as the first/last stage
 * of every pipeline, whether or not a job uses them and whether or not
 * they were explicitly listed in `stages:`. Duplicate stage names are
 * de-duplicated, keeping the first occurrence's position. */
export function effectiveStages(data: Record<string, unknown>): { stages: string[]; isDefault: boolean } {
  const declared = data.stages;
  let userStages: string[];
  let isDefault: boolean;
  if (Array.isArray(declared)) {
    userStages = asStringList(declared);
    isDefault = false;
  } else {
    userStages = [...DEFAULT_USER_STAGES];
    isDefault = true;
  }
  const middle = userStages.filter((s) => s !== '.pre' && s !== '.post');
  const deduped: string[] = [];
  for (const s of middle) {
    if (!deduped.includes(s)) deduped.push(s);
  }
  return { stages: ['.pre', ...deduped, '.post'], isDefault };
}

/** A job's own `stage:`, defaulting to "test" (GitLab's documented default
 * when a job sets no stage:) if unset. */
export function jobStage(job: Record<string, unknown>): string {
  const s = asString(job.stage);
  return s !== '' ? s : 'test';
}

// ---------------------------------------------------------------------------
// script / before_script / after_script
// ---------------------------------------------------------------------------

export function jobScript(job: Record<string, unknown>): string[] {
  return asStringList(job.script);
}

export function jobBeforeScript(job: Record<string, unknown>): string[] {
  return asStringList(job.before_script);
}

export function jobAfterScript(job: Record<string, unknown>): string[] {
  return asStringList(job.after_script);
}

// ---------------------------------------------------------------------------
// image: / services: (global and per-job share the same grammar)
// ---------------------------------------------------------------------------

export interface ImageValue {
  name: string;
  entrypoint: string[];
  pullPolicy: string;
}

/** image: is either a bare string (the image name) or
 * {name, entrypoint, pull_policy}. `pull_policy` may itself be a string or
 * a list (multiple fallback policies); joined with "," when a list. */
export function parseImage(v: unknown): ImageValue {
  if (typeof v === 'string') return { name: v, entrypoint: [], pullPolicy: '' };
  if (isPlainObject(v)) {
    const pp = v.pull_policy;
    const pullPolicy = Array.isArray(pp) ? asStringList(pp).join(',') : asString(pp);
    return { name: asString(v.name), entrypoint: asStringList(v.entrypoint), pullPolicy };
  }
  return { name: '', entrypoint: [], pullPolicy: '' };
}

export interface ServiceValue extends ImageValue {
  alias: string;
  command: string[];
  variables: KV[];
}

/** services: is a list; each entry has the same shape as image: plus
 * alias/command/variables (only services support these three). */
export function parseServices(v: unknown): ServiceValue[] {
  if (!Array.isArray(v)) return [];
  return v.map((entry) => {
    const img = parseImage(entry);
    if (isPlainObject(entry)) {
      return {
        ...img,
        alias: asString(entry.alias),
        command: asStringList(entry.command),
        variables: mapToSortedKVs(entry.variables),
      };
    }
    return { ...img, alias: '', command: [], variables: [] };
  });
}

// ---------------------------------------------------------------------------
// cache:
// ---------------------------------------------------------------------------

export interface CacheValue {
  key: string;
  keyFiles: string[];
  keyPrefix: string;
  paths: string[];
  policy: string;
  when: string;
  unprotect: boolean;
  untracked: boolean;
}

function parseOneCache(v: unknown): CacheValue {
  const out: CacheValue = {
    key: '',
    keyFiles: [],
    keyPrefix: '',
    paths: [],
    policy: '',
    when: '',
    unprotect: false,
    untracked: false,
  };
  if (!isPlainObject(v)) return out;
  const key = v.key;
  if (typeof key === 'string') {
    out.key = key;
  } else if (isPlainObject(key)) {
    out.keyFiles = asStringList(key.files);
    out.keyPrefix = asString(key.prefix);
  }
  out.paths = asStringList(v.paths);
  out.policy = asString(v.policy);
  out.when = asString(v.when);
  out.unprotect = asBool(v.unprotect);
  out.untracked = asBool(v.untracked);
  return out;
}

/** cache: may be a single block or a list of blocks (multiple named
 * caches per job); normalized to a list either way. */
export function parseCache(v: unknown): CacheValue[] {
  if (Array.isArray(v)) return v.map(parseOneCache);
  if (isPlainObject(v)) return [parseOneCache(v)];
  return [];
}

// ---------------------------------------------------------------------------
// artifacts:
// ---------------------------------------------------------------------------

export interface ArtifactsValue {
  paths: string[];
  exclude: string[];
  expireIn: string;
  when: string;
  reports: KV[];
  name: string;
  publicArtifacts: boolean;
  publicSpecified: boolean;
  exposeAs: string;
}

export function parseArtifacts(v: unknown): ArtifactsValue | null {
  if (!isPlainObject(v)) return null;
  const pub = v.public;
  return {
    paths: asStringList(v.paths),
    exclude: asStringList(v.exclude),
    expireIn: asString(v.expire_in),
    when: asString(v.when),
    reports: mapToSortedKVs(v.reports),
    name: asString(v.name),
    publicArtifacts: pub === true,
    publicSpecified: typeof pub === 'boolean',
    exposeAs: asString(v.expose_as),
  };
}

// ---------------------------------------------------------------------------
// rules: / only: / except:
// ---------------------------------------------------------------------------

export interface RuleValue {
  ifCondition: string;
  changes: string[];
  exists: string[];
  when: string;
  allowFailure: boolean;
  allowFailureSpecified: boolean;
  variables: KV[];
  startIn: string;
}

export function parseRules(v: unknown): RuleValue[] {
  if (!Array.isArray(v)) return [];
  return v.map((r) => {
    if (!isPlainObject(r)) {
      return {
        ifCondition: '',
        changes: [],
        exists: [],
        when: '',
        allowFailure: false,
        allowFailureSpecified: false,
        variables: [],
        startIn: '',
      };
    }
    const af = r.allow_failure;
    return {
      ifCondition: asString(r.if),
      changes: asStringList(r.changes),
      exists: asStringList(r.exists),
      when: asString(r.when),
      allowFailure: af === true,
      allowFailureSpecified: typeof af === 'boolean',
      variables: mapToSortedKVs(r.variables),
      startIn: asString(r.start_in),
    };
  });
}

export interface OnlyExceptValue {
  specified: boolean;
  refs: string[];
  kinds: string[];
  variables: string[];
  changes: string[];
}

const ONLY_EXCEPT_KIND_NAMES = new Set(['refs', 'kinds', 'variables', 'changes']);

/** only:/except: is either a bare list of refs (e.g. ["main", "tags"]) or
 * the expanded {refs, kinds, variables, changes} object form. */
export function parseOnlyExcept(v: unknown): OnlyExceptValue {
  const empty: OnlyExceptValue = { specified: false, refs: [], kinds: [], variables: [], changes: [] };
  if (v === undefined || v === null) return empty;
  if (Array.isArray(v) || typeof v === 'string') {
    return { specified: true, refs: asStringList(v), kinds: [], variables: [], changes: [] };
  }
  if (isPlainObject(v)) {
    // Distinguish the expanded object form from an unexpected shape by
    // checking whether it uses any of the four known sub-keys.
    const hasKnownKey = Object.keys(v).some((k) => ONLY_EXCEPT_KIND_NAMES.has(k));
    if (hasKnownKey) {
      return {
        specified: true,
        refs: asStringList(v.refs),
        kinds: asStringList(v.kinds),
        variables: asStringList(v.variables),
        changes: asStringList(v.changes),
      };
    }
  }
  return empty;
}

// ---------------------------------------------------------------------------
// needs:
// ---------------------------------------------------------------------------

export interface NeedValue {
  job: string;
  isSimple: boolean;
  artifacts: boolean;
  artifactsSpecified: boolean;
  optional: boolean;
  optionalSpecified: boolean;
  pipeline: string;
  project: string;
  ref: string;
}

export function parseNeeds(v: unknown): NeedValue[] {
  if (!Array.isArray(v)) return [];
  return v.map((entry): NeedValue => {
    if (typeof entry === 'string') {
      return {
        job: entry,
        isSimple: true,
        artifacts: false,
        artifactsSpecified: false,
        optional: false,
        optionalSpecified: false,
        pipeline: '',
        project: '',
        ref: '',
      };
    }
    if (isPlainObject(entry)) {
      const art = entry.artifacts;
      const opt = entry.optional;
      return {
        job: asString(entry.job),
        isSimple: false,
        artifacts: art === true,
        artifactsSpecified: typeof art === 'boolean',
        optional: opt === true,
        optionalSpecified: typeof opt === 'boolean',
        pipeline: asString(entry.pipeline),
        project: asString(entry.project),
        ref: asString(entry.ref),
      };
    }
    return {
      job: '',
      isSimple: false,
      artifacts: false,
      artifactsSpecified: false,
      optional: false,
      optionalSpecified: false,
      pipeline: '',
      project: '',
      ref: '',
    };
  });
}

// ---------------------------------------------------------------------------
// allow_failure:
// ---------------------------------------------------------------------------

export interface AllowFailureValue {
  allowed: boolean;
  specified: boolean;
  exitCodes: number[];
}

export function parseAllowFailure(v: unknown): AllowFailureValue {
  if (typeof v === 'boolean') return { allowed: v, specified: true, exitCodes: [] };
  if (isPlainObject(v)) {
    const codes = Array.isArray(v.exit_codes)
      ? v.exit_codes.filter((c): c is number => typeof c === 'number')
      : typeof v.exit_codes === 'number'
        ? [v.exit_codes]
        : [];
    return { allowed: false, specified: true, exitCodes: codes };
  }
  return { allowed: false, specified: false, exitCodes: [] };
}

// ---------------------------------------------------------------------------
// extends:
// ---------------------------------------------------------------------------

export function jobExtends(job: Record<string, unknown>): string[] {
  return asStringList(job.extends);
}

// ---------------------------------------------------------------------------
// include:
// ---------------------------------------------------------------------------

export interface IncludeValue {
  kind: string;
  local: string;
  project: string;
  ref: string;
  file: string;
  remote: string;
  template: string;
  component: string;
  inputs: KV[];
}

function classifyOneInclude(entry: unknown): IncludeValue {
  const empty: IncludeValue = {
    kind: 'unknown',
    local: '',
    project: '',
    ref: '',
    file: '',
    remote: '',
    template: '',
    component: '',
    inputs: [],
  };
  if (typeof entry === 'string') {
    // A bare string is shorthand for `local:` (GitLab's own documented
    // shorthand for `include: path/to/file.yml`).
    return { ...empty, kind: 'local', local: entry };
  }
  if (!isPlainObject(entry)) return empty;
  const inputs = mapToSortedKVs(entry.inputs);
  if (typeof entry.local === 'string') {
    return { ...empty, kind: 'local', local: entry.local, inputs };
  }
  if (typeof entry.remote === 'string') {
    return { ...empty, kind: 'remote', remote: entry.remote, inputs };
  }
  if (typeof entry.template === 'string') {
    return { ...empty, kind: 'template', template: entry.template, inputs };
  }
  if (typeof entry.component === 'string') {
    return { ...empty, kind: 'component', component: entry.component, inputs };
  }
  if (typeof entry.project === 'string') {
    return {
      ...empty,
      kind: 'project',
      project: entry.project,
      ref: asString(entry.ref),
      file: asString(entry.file),
      inputs,
    };
  }
  return empty;
}

/** include: may be a single entry (bare string, or one of the
 * local/project/remote/template/component object forms) or a list of
 * them; normalized to a list either way. Never fetches anything — report
 * only. */
export function parseIncludes(v: unknown): IncludeValue[] {
  if (Array.isArray(v)) return v.map(classifyOneInclude);
  if (v === undefined || v === null) return [];
  return [classifyOneInclude(v)];
}

// ---------------------------------------------------------------------------
// extends: resolution — GitLab's documented deep-merge algorithm
// ---------------------------------------------------------------------------
//
// Per https://docs.gitlab.com/ee/ci/yaml/#extends : "extends" merges hash
// (map) keys recursively, key by key; an array-valued or scalar-valued key
// is wholly REPLACED by the higher-precedence value, never concatenated or
// element-merged. With multiple extends targets, they are merged in the
// order listed (later targets override earlier ones on conflict); the
// job's own keys always win over anything inherited.

export class ExtendsCycleError extends Error {}
export class ExtendsDepthError extends Error {}

/** Deep-merges `override` onto a copy of `base`, per GitLab's rule: plain
 * objects merge recursively key-by-key; anything else (array, scalar,
 * null) in `override` wholly replaces the corresponding value in `base`. */
export function deepMergeJobConfig(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const bv = out[key];
    const ov = override[key];
    if (isPlainObject(bv) && isPlainObject(ov)) {
      out[key] = deepMergeJobConfig(bv, ov);
    } else {
      out[key] = ov;
    }
  }
  return out;
}

/** Resolves a job's full effective raw config by walking its `extends:`
 * chain and deep-merging base -> derived, per GitLab's documented rule.
 * Returns the merged raw job object (with its own `extends:` key removed
 * — it has been consumed) plus the resolution order actually walked
 * (base-most first, NOT including jobId itself). Throws ExtendsCycleError
 * if a job (in)directly extends itself, ExtendsDepthError past
 * MAX_EXTENDS_DEPTH hops. */
export function resolveExtendsChain(
  data: Record<string, unknown>,
  jobId: string,
  visiting: string[] = [],
): { merged: Record<string, unknown>; chain: string[] } {
  if (visiting.includes(jobId)) {
    throw new ExtendsCycleError(`extends cycle detected: ${[...visiting, jobId].join(' -> ')}`);
  }
  if (visiting.length >= MAX_EXTENDS_DEPTH) {
    throw new ExtendsDepthError(`extends chain exceeds ${MAX_EXTENDS_DEPTH} hops`);
  }
  const own = findJobEntry(data, jobId);
  if (own === undefined) {
    throw new Error(`job "${jobId}" not found`);
  }
  const targets = jobExtends(own);
  const nextVisiting = [...visiting, jobId];
  let merged: Record<string, unknown> = {};
  let chain: string[] = [];
  for (const target of targets) {
    const resolved = resolveExtendsChain(data, target, nextVisiting);
    merged = deepMergeJobConfig(merged, resolved.merged);
    chain = [...chain, ...resolved.chain.filter((c) => !chain.includes(c)), target].filter(
      (c, i, arr) => arr.indexOf(c) === i,
    );
  }
  const ownWithoutExtends: Record<string, unknown> = { ...own };
  delete ownWithoutExtends.extends;
  merged = deepMergeJobConfig(merged, ownWithoutExtends);
  return { merged, chain };
}
