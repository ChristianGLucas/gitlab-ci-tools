import { JobRequest, ResolveExtendsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parsePipelineYaml,
  looksLikePipeline,
  findJobEntry,
  resolveExtendsChain,
  ExtendsCycleError,
  ExtendsDepthError,
  jobStage,
  jobScript,
  jobBeforeScript,
  jobAfterScript,
  parseImage,
  parseCache,
  parseArtifacts,
  parseRules,
  mapToSortedKVs,
  asStringList,
  errorMessage,
  BoundsError,
} from './lib';
import { buildImageRef, buildCacheConfig, buildArtifactsConfig, buildRuleCondition, buildKVList } from './build';

/**
 * Resolve a job's extends: inheritance by deep-merging the extended
 * job(s)' config into the job's own, implementing GitLab's documented
 * merge rule: hash-valued keys (like variables:) are recursively
 * deep-merged key by key, while array-valued and scalar keys (script,
 * tags, rules, image, ...) are wholly replaced by the more specific
 * value. Multiple extends targets apply in listed order; the job's own
 * keys always win. Detects and reports extends cycles.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function resolveExtends(ax: AxiomContext, input: JobRequest): ResolveExtendsResult {
  const out = new ResolveExtendsResult();
  try {
    const { data, parseError } = parsePipelineYaml(input.getYaml());
    if (parseError !== null) {
      out.setError(parseError);
      return out;
    }
    if (!looksLikePipeline(data)) {
      out.setError('pipeline is not a YAML mapping');
      return out;
    }
    const doc = data as Record<string, unknown>;
    const jobId = input.getJobId();
    if (findJobEntry(doc, jobId) === undefined) {
      out.setError(`job "${jobId}" not found`);
      return out;
    }

    let merged: Record<string, unknown>;
    let chain: string[];
    try {
      const resolved = resolveExtendsChain(doc, jobId);
      merged = resolved.merged;
      chain = resolved.chain;
    } catch (e) {
      if (e instanceof ExtendsCycleError || e instanceof ExtendsDepthError) {
        out.setError(e.message);
        return out;
      }
      throw e;
    }

    out.setFound(true);
    out.setExtendsChainList(chain);
    out.setMergedStage(jobStage(merged));
    out.setMergedScriptList(jobScript(merged));
    out.setMergedBeforeScriptList(jobBeforeScript(merged));
    out.setMergedAfterScriptList(jobAfterScript(merged));
    out.setMergedVariablesList(buildKVList(mapToSortedKVs(merged.variables)));
    out.setMergedTagsList(asStringList(merged.tags));

    if (merged.image !== undefined) {
      out.setMergedImage(buildImageRef(parseImage(merged.image)));
      out.setHasImage(true);
    }

    out.setMergedRulesList(parseRules(merged.rules).map(buildRuleCondition));
    out.setMergedCacheList(parseCache(merged.cache).map(buildCacheConfig));

    const artifacts = parseArtifacts(merged.artifacts);
    if (artifacts !== null) {
      out.setMergedArtifacts(buildArtifactsConfig(artifacts));
      out.setHasArtifacts(true);
    }
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'resolving extends'));
    return out;
  }
}
