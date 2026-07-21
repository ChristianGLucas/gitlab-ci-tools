import { Pipeline, ExtractCacheResult, JobCache } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parsePipelineYaml, looksLikePipeline, listRealJobEntries, parseCache, errorMessage, BoundsError } from './lib';
import { buildCacheConfig } from './build';

/**
 * Extract every job's cache: declaration(s) — key (literal or
 * files/prefix-derived), paths, policy, when, unprotect, and untracked. A
 * job may declare one cache block or a list of several; both forms are
 * normalized to a list here. Jobs with no cache: block are omitted.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function extractCache(ax: AxiomContext, input: Pipeline): ExtractCacheResult {
  const out = new ExtractCacheResult();
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
    const results: JobCache[] = [];
    for (const [jobId, job] of listRealJobEntries(doc)) {
      const caches = parseCache(job.cache);
      if (caches.length === 0) continue;
      const jc = new JobCache();
      jc.setJobId(jobId);
      jc.setCacheList(caches.map(buildCacheConfig));
      results.push(jc);
    }
    out.setCachesList(results);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'extracting cache'));
    return out;
  }
}
