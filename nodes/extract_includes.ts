import { Pipeline, ExtractIncludesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parsePipelineYaml, looksLikePipeline, parseIncludes, errorMessage, BoundsError } from './lib';
import { buildIncludeEntry } from './build';

/**
 * Extract every include: directive in the pipeline — local, project,
 * remote, template, and component includes — classified and decomposed
 * (local path / project+ref+file / remote URL / template name / component
 * ref) with any inputs:. Never fetches the included content; report only
 * — this package never makes a network call or a GitLab API request.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function extractIncludes(ax: AxiomContext, input: Pipeline): ExtractIncludesResult {
  const out = new ExtractIncludesResult();
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
    out.setIncludesList(parseIncludes(doc.include).map(buildIncludeEntry));
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'extracting includes'));
    return out;
  }
}
