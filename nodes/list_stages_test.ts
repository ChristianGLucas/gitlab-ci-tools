import { Pipeline } from '../gen/messages_pb';
import { listStages } from './list_stages';
import {
  ctx,
  FIXTURE_PIPELINE,
  FIXTURE_STAGES_ORACLE,
  MINIMAL_PIPELINE,
  STAGES_WITH_EXPLICIT_PRE_POST,
  NOT_A_MAPPING_PIPELINE,
} from './testkit';

describe('ListStages', () => {
  it('returns the declared stages with implicit .pre/.post positioned first/last', () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = listStages(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getStagesList()).toEqual(FIXTURE_STAGES_ORACLE);
    expect(result.getIsDefault()).toBe(false);
  });

  it('falls back to the GitLab default stage list when stages: is absent', () => {
    const input = new Pipeline();
    input.setYaml(MINIMAL_PIPELINE);
    const result = listStages(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getStagesList()).toEqual(['.pre', 'build', 'test', 'deploy', '.post']);
    expect(result.getIsDefault()).toBe(true);
  });

  it('forces .pre first and .post last even when declared out of order, deduping the middle', () => {
    const input = new Pipeline();
    input.setYaml(STAGES_WITH_EXPLICIT_PRE_POST);
    const result = listStages(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getStagesList()).toEqual(['.pre', 'build', 'test', 'deploy', '.post']);
    expect(result.getIsDefault()).toBe(false);
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = listStages(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
