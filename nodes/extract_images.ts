import { Pipeline, ExtractImagesResult, JobImages } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parsePipelineYaml,
  looksLikePipeline,
  listRealJobEntries,
  parseImage,
  parseServices,
  errorMessage,
  BoundsError,
} from './lib';
import { buildImageRef, buildServiceRef } from './build';

/**
 * Extract every container image referenced in the pipeline for
 * supply-chain auditing: the global image: and services:, plus each
 * job's own image: and services: overrides.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function extractImages(ax: AxiomContext, input: Pipeline): ExtractImagesResult {
  const out = new ExtractImagesResult();
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
    if (doc.image !== undefined) {
      out.setGlobalImage(buildImageRef(parseImage(doc.image)));
      out.setHasGlobalImage(true);
    }
    out.setGlobalServicesList(parseServices(doc.services).map(buildServiceRef));

    const jobImages: JobImages[] = [];
    for (const [jobId, job] of listRealJobEntries(doc)) {
      if (job.image === undefined && job.services === undefined) continue;
      const ji = new JobImages();
      ji.setJobId(jobId);
      if (job.image !== undefined) {
        ji.setImage(buildImageRef(parseImage(job.image)));
        ji.setHasImage(true);
      }
      ji.setServicesList(parseServices(job.services).map(buildServiceRef));
      jobImages.push(ji);
    }
    out.setJobImagesList(jobImages);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'extracting images'));
    return out;
  }
}
