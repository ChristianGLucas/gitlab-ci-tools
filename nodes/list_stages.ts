import { Pipeline, ListStagesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parsePipelineYaml, looksLikePipeline, effectiveStages, errorMessage, BoundsError } from './lib';

/**
 * List the pipeline's stages in effective execution order, including the
 * always-implicit ".pre" (first) and ".post" (last) stages GitLab adds
 * regardless of declaration. Uses the explicit top-level stages: list when
 * present, else GitLab's default ["build", "test", "deploy"].
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function listStages(ax: AxiomContext, input: Pipeline): ListStagesResult {
  const out = new ListStagesResult();
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
    const { stages, isDefault } = effectiveStages(doc);
    out.setStagesList(stages);
    out.setIsDefault(isDefault);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'listing stages'));
    return out;
  }
}
