import { Pipeline, SummarizePipelineResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parsePipelineYaml,
  looksLikePipeline,
  listAllJobEntries,
  isHiddenJobId,
  effectiveStages,
  parseIncludes,
  mapToSortedKVs,
  listRealJobEntries,
  isPlainObject,
  errorMessage,
  BoundsError,
} from './lib';

/**
 * Summarize a pipeline: real job count, hidden/template job count, stage
 * count, include: directive count, distinct global+job variable count,
 * and whether default: / workflow: blocks are present.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function summarizePipeline(ax: AxiomContext, input: Pipeline): SummarizePipelineResult {
  const out = new SummarizePipelineResult();
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
    const allEntries = listAllJobEntries(doc);
    const hidden = allEntries.filter(([id]) => isHiddenJobId(id));
    const real = allEntries.filter(([id]) => !isHiddenJobId(id));

    out.setJobCount(real.length);
    out.setHiddenJobCount(hidden.length);
    out.setStageCount(effectiveStages(doc).stages.length);
    out.setIncludeCount(parseIncludes(doc.include).length);

    const distinctVarNames = new Set<string>();
    for (const kv of mapToSortedKVs(doc.variables)) distinctVarNames.add(`global:${kv.key}`);
    for (const [jobId, job] of listRealJobEntries(doc)) {
      for (const kv of mapToSortedKVs(job.variables)) distinctVarNames.add(`${jobId}:${kv.key}`);
    }
    out.setVariableCount(distinctVarNames.size);

    out.setHasWorkflow(isPlainObject(doc.workflow));
    out.setHasDefault(isPlainObject(doc.default));
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'summarizing pipeline'));
    return out;
  }
}
