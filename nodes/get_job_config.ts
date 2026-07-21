import { JobRequest, GetJobConfigResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parsePipelineYaml,
  looksLikePipeline,
  findJobEntry,
  jobStage,
  jobScript,
  jobBeforeScript,
  jobAfterScript,
  jobExtends,
  parseImage,
  parseServices,
  parseCache,
  parseArtifacts,
  parseRules,
  parseOnlyExcept,
  parseNeeds,
  parseAllowFailure,
  mapToSortedKVs,
  asStringList,
  asString,
  errorMessage,
  BoundsError,
} from './lib';
import {
  buildImageRef,
  buildServiceRef,
  buildCacheConfig,
  buildArtifactsConfig,
  buildRuleCondition,
  buildOnlyExceptConfig,
  buildNeedRef,
  buildAllowFailureConfig,
  buildKVList,
} from './build';

/**
 * Extract one job's full raw config: script, before_script, after_script,
 * image, services, variables, artifacts, cache, rules, only/except,
 * needs, extends, tags, when, and allow_failure. Does NOT resolve
 * extends: inheritance — that is ResolveExtends' job; this node reports
 * the job's own declared config exactly as written.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function getJobConfig(ax: AxiomContext, input: JobRequest): GetJobConfigResult {
  const out = new GetJobConfigResult();
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
    const job = findJobEntry(doc, jobId);
    if (job === undefined) {
      out.setError(`job "${jobId}" not found`);
      return out;
    }

    out.setFound(true);
    out.setJobId(jobId);
    out.setStage(jobStage(job));
    out.setScriptList(jobScript(job));
    out.setBeforeScriptList(jobBeforeScript(job));
    out.setAfterScriptList(jobAfterScript(job));

    if (job.image !== undefined) {
      out.setImage(buildImageRef(parseImage(job.image)));
      out.setHasImage(true);
    }
    out.setServicesList(parseServices(job.services).map(buildServiceRef));
    out.setVariablesList(buildKVList(mapToSortedKVs(job.variables)));

    const artifacts = parseArtifacts(job.artifacts);
    if (artifacts !== null) {
      out.setArtifacts(buildArtifactsConfig(artifacts));
      out.setHasArtifacts(true);
    }

    out.setCacheList(parseCache(job.cache).map(buildCacheConfig));
    out.setRulesList(parseRules(job.rules).map(buildRuleCondition));
    out.setOnly(buildOnlyExceptConfig(parseOnlyExcept(job.only)));
    out.setExcept(buildOnlyExceptConfig(parseOnlyExcept(job.except)));
    out.setNeedsList(parseNeeds(job.needs).map(buildNeedRef));
    out.setExtendsList(jobExtends(job));
    out.setTagsList(asStringList(job.tags));
    out.setWhen(asString(job.when));
    out.setAllowFailure(buildAllowFailureConfig(parseAllowFailure(job.allow_failure)));
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'getting job config'));
    return out;
  }
}
