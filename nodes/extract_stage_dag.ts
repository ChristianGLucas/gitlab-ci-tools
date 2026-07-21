import { Pipeline, ExtractStageDAGResult, StageJobs } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parsePipelineYaml,
  looksLikePipeline,
  listRealJobEntries,
  effectiveStages,
  jobStage,
  errorMessage,
  BoundsError,
} from './lib';

/**
 * Extract the stage-ordering DAG: effective stage order (with implicit
 * .pre/.post) paired with which real jobs run in each stage — jobs in the
 * same stage run in parallel; each stage waits for the previous stage to
 * complete. A job whose stage: names something outside the declared
 * stages list is still grouped under that (undeclared) name — see
 * ValidatePipeline to catch that as a structural issue.
 *
 * @param ax - Platform context: ax.log for logging.
 */
export function extractStageDAG(ax: AxiomContext, input: Pipeline): ExtractStageDAGResult {
  const out = new ExtractStageDAGResult();
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
    const { stages } = effectiveStages(doc);
    out.setStagesList(stages);

    const byStage = new Map<string, string[]>();
    for (const s of stages) byStage.set(s, []);
    for (const [jobId, job] of listRealJobEntries(doc)) {
      const stage = jobStage(job);
      if (!byStage.has(stage)) byStage.set(stage, []);
      byStage.get(stage)!.push(jobId);
    }

    // Emit in effective-stage order first, then any undeclared stages a
    // job referenced (in first-seen order), so nothing is silently
    // dropped.
    const orderedStageNames = [...stages, ...[...byStage.keys()].filter((s) => !stages.includes(s))];
    const stageJobs: StageJobs[] = orderedStageNames.map((stage) => {
      const sj = new StageJobs();
      sj.setStage(stage);
      sj.setJobIdsList(byStage.get(stage) ?? []);
      return sj;
    });
    out.setStageJobsList(stageJobs);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError ? e.message : errorMessage(e, 'extracting stage DAG'));
    return out;
  }
}
