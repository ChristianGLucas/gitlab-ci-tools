import { JobRequest, ExtractRulesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parsePipelineYaml, looksLikePipeline, findJobEntry, parseRules, parseOnlyExcept, errorMessage, BoundsError } from './lib';
import { buildRuleCondition, buildOnlyExceptConfig } from './build';

/**
 * Extract one job's rules:, only:, and except: conditions in full —
 * if/changes/exists/when/allow_failure/variables/start_in per rule, and
 * the normalized only/except refs/kinds/variables/changes.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function extractRules(ax: AxiomContext, input: JobRequest): ExtractRulesResult {
  const out = new ExtractRulesResult();
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
    out.setRulesList(parseRules(job.rules).map(buildRuleCondition));
    out.setOnly(buildOnlyExceptConfig(parseOnlyExcept(job.only)));
    out.setExcept(buildOnlyExceptConfig(parseOnlyExcept(job.except)));
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'extracting rules'));
    return out;
  }
}
