import { Pipeline, ExtractJobDependenciesResult, JobDependencyEdge } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parsePipelineYaml,
  looksLikePipeline,
  listRealJobEntries,
  parseNeeds,
  errorMessage,
  BoundsError,
} from './lib';

/**
 * Extract the pipeline's needs: dependency graph as an edge list (job
 * needs depends_on), plus the full set of real job ids, ready for
 * topological analysis. Cross-pipeline needs (entries with pipeline:/
 * project: set) are included with their target job name as depends_on
 * even though that job does not exist in THIS document — a caller can
 * detect these by checking membership against job_ids.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function extractJobDependencies(ax: AxiomContext, input: Pipeline): ExtractJobDependenciesResult {
  const out = new ExtractJobDependenciesResult();
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
    const entries = listRealJobEntries(doc);
    out.setJobIdsList(entries.map(([id]) => id));

    const edges: JobDependencyEdge[] = [];
    for (const [jobId, job] of entries) {
      for (const need of parseNeeds(job.needs)) {
        if (need.job === '') continue;
        const edge = new JobDependencyEdge();
        edge.setJobId(jobId);
        edge.setDependsOn(need.job);
        edges.push(edge);
      }
    }
    out.setEdgesList(edges);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'extracting job dependencies'));
    return out;
  }
}
