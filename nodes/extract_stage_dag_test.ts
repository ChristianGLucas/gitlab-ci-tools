import { Pipeline } from '../gen/messages_pb';
import { extractStageDAG } from './extract_stage_dag';
import { ctx, FIXTURE_PIPELINE, FIXTURE_STAGES_ORACLE, NOT_A_MAPPING_PIPELINE } from './testkit';

describe('ExtractStageDAG', () => {
  it('groups real jobs under their stage, in effective stage order', () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = extractStageDAG(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getStagesList()).toEqual(FIXTURE_STAGES_ORACLE);

    const byStage = new Map(result.getStageJobsList().map((sj) => [sj.getStage(), sj.getJobIdsList()]));
    expect(byStage.get('.pre')).toEqual([]);
    expect(byStage.get('build')).toEqual(['build']);
    // test and cross_pipeline_job are both stage: test.
    expect(byStage.get('test')).toEqual(['test', 'cross_pipeline_job']);
    expect(byStage.get('deploy')).toEqual(['deploy']);
    expect(byStage.get('.post')).toEqual([]);
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = extractStageDAG(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
