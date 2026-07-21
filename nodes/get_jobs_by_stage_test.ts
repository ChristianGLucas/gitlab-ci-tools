import { StageRequest } from '../gen/messages_pb';
import { getJobsByStage } from './get_jobs_by_stage';
import { ctx, FIXTURE_PIPELINE } from './testkit';

function req(stage: string): StageRequest {
  const r = new StageRequest();
  r.setYaml(FIXTURE_PIPELINE);
  r.setStage(stage);
  return r;
}

describe('GetJobsByStage', () => {
  it('lists both jobs assigned to the "test" stage', () => {
    const result = getJobsByStage(ctx, req('test'));
    expect(result.getError()).toBe('');
    expect(result.getJobIdsList()).toEqual(['test', 'cross_pipeline_job']);
  });

  it('lists the single "build" job', () => {
    const result = getJobsByStage(ctx, req('build'));
    expect(result.getJobIdsList()).toEqual(['build']);
  });

  it('returns an empty list (not an error) for an undeclared stage name', () => {
    const result = getJobsByStage(ctx, req('nonexistent-stage'));
    expect(result.getError()).toBe('');
    expect(result.getJobIdsList()).toEqual([]);
  });
});
