import { Pipeline, ParsePipelineResult, JobBrief } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parsePipelineYaml,
  looksLikePipeline,
  listRealJobEntries,
  jobStage,
  jobScript,
  effectiveStages,
  isPlainObject,
  errorMessage,
  BoundsError,
} from './lib';

/**
 * Parse a .gitlab-ci.yml pipeline into its top-level structure: effective
 * stage order (including the always-implicit .pre/.post), a brief per-job
 * summary (id, stage, has_script, script line count), and flags for
 * whether the pipeline declares variables:, default:, workflow:, and
 * include:. The quick "what does this pipeline look like" overview — for
 * the full per-job attribute set use ListJobs.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function parsePipeline(ax: AxiomContext, input: Pipeline): ParsePipelineResult {
  const out = new ParsePipelineResult();
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

    out.setStagesList(effectiveStages(doc).stages);
    out.setHasVariables(isPlainObject(doc.variables));
    out.setHasDefault(isPlainObject(doc.default));
    out.setHasWorkflow(isPlainObject(doc.workflow));
    out.setHasInclude(doc.include !== undefined);

    const jobs: JobBrief[] = [];
    for (const [jobId, job] of listRealJobEntries(doc)) {
      const brief = new JobBrief();
      brief.setJobId(jobId);
      brief.setStage(jobStage(job));
      const script = jobScript(job);
      brief.setHasScript(script.length > 0);
      brief.setScriptLineCount(script.length);
      jobs.push(brief);
    }
    out.setJobsList(jobs);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'parsing pipeline'));
    return out;
  }
}
