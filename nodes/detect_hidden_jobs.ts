import { Pipeline, DetectHiddenJobsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parsePipelineYaml, looksLikePipeline, listAllJobEntries, isHiddenJobId, errorMessage, BoundsError } from './lib';

/**
 * Detect hidden/template job keys (names starting with ".") in the
 * pipeline — entries that are not scheduled as real jobs but exist to be
 * pulled in via extends:.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function detectHiddenJobs(ax: AxiomContext, input: Pipeline): DetectHiddenJobsResult {
  const out = new DetectHiddenJobsResult();
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
    const hidden = listAllJobEntries(doc)
      .map(([id]) => id)
      .filter(isHiddenJobId);
    out.setHiddenJobIdsList(hidden);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'detecting hidden jobs'));
    return out;
  }
}
