import { Pipeline, ValidatePipelineResult, PipelineIssue } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parsePipelineYaml,
  looksLikePipeline,
  listRealJobEntries,
  listAllJobEntries,
  findJobEntry,
  effectiveStages,
  jobStage,
  jobExtends,
  parseNeeds,
  errorMessage,
  BoundsError,
} from './lib';

function issue(path: string, message: string): PipelineIssue {
  const i = new PipelineIssue();
  i.setPath(path);
  i.setMessage(message);
  return i;
}

/**
 * Validate a pipeline's basic structural correctness: every job's stage:
 * (if set, or its default "test") is a declared stage, every needs: entry
 * references an existing same-pipeline job (cross-pipeline needs with
 * pipeline:/project: are skipped), and every extends: target exists.
 * Reports every violation found, not just the first.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function validatePipeline(ax: AxiomContext, input: Pipeline): ValidatePipelineResult {
  const out = new ValidatePipelineResult();
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
    const issues: PipelineIssue[] = [];

    const { stages } = effectiveStages(doc);
    const realEntries = listRealJobEntries(doc);
    const realJobIds = new Set(realEntries.map(([id]) => id));

    for (const [jobId, job] of realEntries) {
      const stage = jobStage(job);
      if (!stages.includes(stage)) {
        issues.push(issue(`jobs.${jobId}.stage`, `stage "${stage}" is not declared in stages: ${stages.join(', ')}`));
      }

      for (const need of parseNeeds(job.needs)) {
        // Cross-pipeline needs (pipeline:/project: set) reference a job in
        // a DIFFERENT pipeline document — not resolvable or checkable here.
        if (need.pipeline !== '' || need.project !== '') continue;
        if (need.job === '') {
          issues.push(issue(`jobs.${jobId}.needs`, 'needs entry has no job name'));
          continue;
        }
        if (!realJobIds.has(need.job)) {
          issues.push(issue(`jobs.${jobId}.needs`, `needs references unknown job "${need.job}"`));
        }
      }

      for (const target of jobExtends(job)) {
        if (findJobEntry(doc, target) === undefined) {
          issues.push(issue(`jobs.${jobId}.extends`, `extends references unknown job "${target}"`));
        }
      }
    }

    // extends: targets are also checked from hidden/template jobs, since
    // hidden jobs can themselves extend other (hidden) jobs.
    for (const [jobId, job] of listAllJobEntries(doc)) {
      if (realJobIds.has(jobId)) continue; // already checked above
      for (const target of jobExtends(job)) {
        if (findJobEntry(doc, target) === undefined) {
          issues.push(issue(`jobs.${jobId}.extends`, `extends references unknown job "${target}"`));
        }
      }
    }

    out.setValid(issues.length === 0);
    out.setIssuesList(issues);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'validating pipeline'));
    return out;
  }
}
