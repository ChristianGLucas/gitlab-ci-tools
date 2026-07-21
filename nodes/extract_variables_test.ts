import { Pipeline } from '../gen/messages_pb';
import { extractVariables } from './extract_variables';
import { ctx, FIXTURE_PIPELINE, NOT_A_MAPPING_PIPELINE } from './testkit';

describe('ExtractVariables', () => {
  it('extracts global variables:, sorted by key', () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = extractVariables(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getGlobalVariablesList().map((kv) => [kv.getKey(), kv.getValue()])).toEqual([
      ['DEPLOY_ENV', 'staging'],
      ['GLOBAL_VAR', 'global-value'],
    ]);
    // No real job in the fixture declares its OWN variables: block (only
    // the hidden .base_job does, which is excluded).
    expect(result.getJobVariablesList()).toHaveLength(0);
  });

  it('extracts a job-level variables: block, coercing a non-string scalar to string', () => {
    const input = new Pipeline();
    input.setYaml(`
build:
  variables:
    RETRY_COUNT: 3
    ENABLED: true
  script:
    - echo hi
`);
    const result = extractVariables(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getJobVariablesList()).toHaveLength(1);
    const jv = result.getJobVariablesList()[0];
    expect(jv.getJobId()).toBe('build');
    expect(jv.getVariablesList().map((kv) => [kv.getKey(), kv.getValue()])).toEqual([
      ['ENABLED', 'true'],
      ['RETRY_COUNT', '3'],
    ]);
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = extractVariables(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
