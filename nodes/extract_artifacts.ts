import { Pipeline, ExtractArtifactsResult, JobArtifacts } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parsePipelineYaml, looksLikePipeline, listRealJobEntries, parseArtifacts, errorMessage, BoundsError } from './lib';
import { buildArtifactsConfig } from './build';

/**
 * Extract every job's artifacts: declaration — paths, exclude, expire_in,
 * when, reports (type -> path), name, public, and expose_as. Jobs with no
 * artifacts: block are omitted entirely.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function extractArtifacts(ax: AxiomContext, input: Pipeline): ExtractArtifactsResult {
  const out = new ExtractArtifactsResult();
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
    const results: JobArtifacts[] = [];
    for (const [jobId, job] of listRealJobEntries(doc)) {
      const artifacts = parseArtifacts(job.artifacts);
      if (artifacts === null) continue;
      const ja = new JobArtifacts();
      ja.setJobId(jobId);
      ja.setArtifacts(buildArtifactsConfig(artifacts));
      results.push(ja);
    }
    out.setArtifactsList(results);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'extracting artifacts'));
    return out;
  }
}
