import { Pipeline } from '../gen/messages_pb';
import { summarizePipeline } from './summarize_pipeline';
import { ctx, FIXTURE_PIPELINE, NOT_A_MAPPING_PIPELINE } from './testkit';

describe('SummarizePipeline', () => {
  it('summarizes job/stage/include/variable counts and default/workflow flags', () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = summarizePipeline(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getJobCount()).toBe(4); // build, test, deploy, cross_pipeline_job
    expect(result.getHiddenJobCount()).toBe(2); // .base_job, .build_template
    expect(result.getStageCount()).toBe(5); // .pre, build, test, deploy, .post
    expect(result.getIncludeCount()).toBe(5);
    expect(result.getVariableCount()).toBe(2); // GLOBAL_VAR, DEPLOY_ENV (no job-level ones)
    expect(result.getHasWorkflow()).toBe(false);
    expect(result.getHasDefault()).toBe(false);
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = summarizePipeline(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
