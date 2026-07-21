import { StageRequest, GetJobsByStageResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parsePipelineYaml, looksLikePipeline, listRealJobEntries, jobStage, errorMessage, BoundsError } from './lib';

/**
 * List the ids of every real job assigned to a given stage name, in
 * document order. An unknown/undeclared stage name simply yields zero
 * job ids (not an error) — pair with ListStages to check whether the
 * stage itself is declared.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function getJobsByStage(ax: AxiomContext, input: StageRequest): GetJobsByStageResult {
  const out = new GetJobsByStageResult();
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
    const stage = input.getStage();
    const ids = listRealJobEntries(doc)
      .filter(([, job]) => jobStage(job) === stage)
      .map(([id]) => id);
    out.setJobIdsList(ids);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'getting jobs by stage'));
    return out;
  }
}
