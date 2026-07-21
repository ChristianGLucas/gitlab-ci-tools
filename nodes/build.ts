// Builders that turn this package's plain-JS parsed values (from lib.ts)
// into the generated protobuf message instances. Kept separate from lib.ts
// (which has no dependency on gen/) so lib.ts stays trivially unit-testable
// without the generated bindings. Not a node and not a test file.

import {
  KeyValue,
  ImageRef,
  ServiceRef,
  CacheConfig,
  ArtifactsConfig,
  RuleCondition,
  OnlyExceptConfig,
  NeedRef,
  AllowFailureConfig,
  IncludeEntry,
} from '../gen/messages_pb';
import {
  KV,
  ImageValue,
  ServiceValue,
  CacheValue,
  ArtifactsValue,
  RuleValue,
  OnlyExceptValue,
  NeedValue,
  AllowFailureValue,
  IncludeValue,
} from './lib';

export function buildKV(kv: KV): KeyValue {
  const m = new KeyValue();
  m.setKey(kv.key);
  m.setValue(kv.value);
  return m;
}

export function buildKVList(kvs: KV[]): KeyValue[] {
  return kvs.map(buildKV);
}

export function buildImageRef(img: ImageValue): ImageRef {
  const m = new ImageRef();
  m.setName(img.name);
  m.setEntrypointList(img.entrypoint);
  m.setPullPolicy(img.pullPolicy);
  return m;
}

export function buildServiceRef(svc: ServiceValue): ServiceRef {
  const m = new ServiceRef();
  m.setName(svc.name);
  m.setEntrypointList(svc.entrypoint);
  m.setPullPolicy(svc.pullPolicy);
  m.setAlias(svc.alias);
  m.setCommandList(svc.command);
  m.setVariablesList(buildKVList(svc.variables));
  return m;
}

export function buildCacheConfig(c: CacheValue): CacheConfig {
  const m = new CacheConfig();
  m.setKey(c.key);
  m.setKeyFilesList(c.keyFiles);
  m.setKeyPrefix(c.keyPrefix);
  m.setPathsList(c.paths);
  m.setPolicy(c.policy);
  m.setWhen(c.when);
  m.setUnprotect(c.unprotect);
  m.setUntracked(c.untracked);
  return m;
}

export function buildArtifactsConfig(a: ArtifactsValue): ArtifactsConfig {
  const m = new ArtifactsConfig();
  m.setPathsList(a.paths);
  m.setExcludeList(a.exclude);
  m.setExpireIn(a.expireIn);
  m.setWhen(a.when);
  m.setReportsList(buildKVList(a.reports));
  m.setName(a.name);
  m.setPublicArtifacts(a.publicArtifacts);
  m.setPublicSpecified(a.publicSpecified);
  m.setExposeAs(a.exposeAs);
  return m;
}

export function buildRuleCondition(r: RuleValue): RuleCondition {
  const m = new RuleCondition();
  m.setIfCondition(r.ifCondition);
  m.setChangesList(r.changes);
  m.setExistsList(r.exists);
  m.setWhen(r.when);
  m.setAllowFailure(r.allowFailure);
  m.setAllowFailureSpecified(r.allowFailureSpecified);
  m.setVariablesList(buildKVList(r.variables));
  m.setStartIn(r.startIn);
  return m;
}

export function buildOnlyExceptConfig(o: OnlyExceptValue): OnlyExceptConfig {
  const m = new OnlyExceptConfig();
  m.setSpecified(o.specified);
  m.setRefsList(o.refs);
  m.setKindsList(o.kinds);
  m.setVariablesList(o.variables);
  m.setChangesList(o.changes);
  return m;
}

export function buildNeedRef(n: NeedValue): NeedRef {
  const m = new NeedRef();
  m.setJob(n.job);
  m.setIsSimple(n.isSimple);
  m.setArtifacts(n.artifacts);
  m.setArtifactsSpecified(n.artifactsSpecified);
  m.setOptional(n.optional);
  m.setOptionalSpecified(n.optionalSpecified);
  m.setPipeline(n.pipeline);
  m.setProject(n.project);
  m.setRef(n.ref);
  return m;
}

export function buildAllowFailureConfig(a: AllowFailureValue): AllowFailureConfig {
  const m = new AllowFailureConfig();
  m.setAllowed(a.allowed);
  m.setSpecified(a.specified);
  m.setExitCodesList(a.exitCodes);
  return m;
}

export function buildIncludeEntry(i: IncludeValue): IncludeEntry {
  const m = new IncludeEntry();
  m.setKind(i.kind);
  m.setLocal(i.local);
  m.setProject(i.project);
  m.setRef(i.ref);
  m.setFile(i.file);
  m.setRemote(i.remote);
  m.setTemplate(i.template);
  m.setComponent(i.component);
  m.setInputsList(buildKVList(i.inputs));
  return m;
}
