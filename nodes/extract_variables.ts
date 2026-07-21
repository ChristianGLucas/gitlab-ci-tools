import { Pipeline, ExtractVariablesResult, JobVariables } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parsePipelineYaml, looksLikePipeline, listRealJobEntries, mapToSortedKVs, errorMessage, BoundsError } from './lib';
import { buildKVList } from './build';

/**
 * Extract the global (top-level) variables: block and every job-level
 * variables: block across the pipeline.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function extractVariables(ax: AxiomContext, input: Pipeline): ExtractVariablesResult {
  const out = new ExtractVariablesResult();
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
    out.setGlobalVariablesList(buildKVList(mapToSortedKVs(doc.variables)));

    const jobVars: JobVariables[] = [];
    for (const [jobId, job] of listRealJobEntries(doc)) {
      if (job.variables === undefined) continue;
      const jv = new JobVariables();
      jv.setJobId(jobId);
      jv.setVariablesList(buildKVList(mapToSortedKVs(job.variables)));
      jobVars.push(jv);
    }
    out.setJobVariablesList(jobVars);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'extracting variables'));
    return out;
  }
}
