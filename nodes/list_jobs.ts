import { Pipeline, ListJobsResult, JobSummary } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parsePipelineYaml,
  looksLikePipeline,
  listRealJobEntries,
  jobStage,
  jobScript,
  parseNeeds,
  parseRules,
  asString,
  errorMessage,
  BoundsError,
} from './lib';
import { buildNeedRef, buildRuleCondition } from './build';

/**
 * List every real (non-hidden) job in the pipeline with name, stage,
 * script, needs, rules, and when — correctly excluding reserved top-level
 * keywords (stages, variables, default, include, workflow, image,
 * services, cache, before_script, after_script, types) and hidden/
 * template jobs (names starting with ".") from the job list.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function listJobs(ax: AxiomContext, input: Pipeline): ListJobsResult {
  const out = new ListJobsResult();
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
    const jobs: JobSummary[] = [];
    for (const [jobId, job] of listRealJobEntries(doc)) {
      const s = new JobSummary();
      s.setJobId(jobId);
      s.setStage(jobStage(job));
      s.setScriptList(jobScript(job));
      s.setNeedsList(parseNeeds(job.needs).map(buildNeedRef));
      s.setRulesList(parseRules(job.rules).map(buildRuleCondition));
      s.setWhen(asString(job.when));
      jobs.push(s);
    }
    out.setJobsList(jobs);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'listing jobs'));
    return out;
  }
}
