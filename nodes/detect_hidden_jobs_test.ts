import { Pipeline } from '../gen/messages_pb';
import { detectHiddenJobs } from './detect_hidden_jobs';
import { ctx, FIXTURE_PIPELINE, FIXTURE_HIDDEN_JOB_IDS_ORACLE, NOT_A_MAPPING_PIPELINE } from './testkit';

describe('DetectHiddenJobs', () => {
  it('finds every hidden/template job key (starting with ".")', () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = detectHiddenJobs(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getHiddenJobIdsList()).toEqual(FIXTURE_HIDDEN_JOB_IDS_ORACLE);
  });

  it('returns an empty list when the pipeline has no hidden jobs', () => {
    const input = new Pipeline();
    input.setYaml('build:\n  script:\n    - echo hi\n');
    const result = detectHiddenJobs(ctx, input);
    expect(result.getHiddenJobIdsList()).toEqual([]);
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = detectHiddenJobs(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
