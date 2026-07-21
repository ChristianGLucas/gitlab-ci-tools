import { JobRequest } from '../gen/messages_pb';
import { extractRules } from './extract_rules';
import { ctx, FIXTURE_PIPELINE } from './testkit';

describe('ExtractRules', () => {
  it("extracts test's rules: in full", () => {
    const input = new JobRequest();
    input.setYaml(FIXTURE_PIPELINE);
    input.setJobId('test');
    const result = extractRules(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getFound()).toBe(true);
    const rules = result.getRulesList();
    expect(rules).toHaveLength(2);
    expect(rules[0].getIfCondition()).toBe('$CI_PIPELINE_SOURCE == "merge_request_event"');
    expect(rules[0].getWhen()).toBe('always');
    expect(rules[1].getIfCondition()).toBe('$CI_COMMIT_BRANCH == "main"');
    expect(rules[1].getChangesList()).toEqual(['src/**/*']);
    expect(result.getOnly()!.getSpecified()).toBe(false);
    expect(result.getExcept()!.getSpecified()).toBe(false);
  });

  it("extracts deploy's only:, normalized to the expanded object form", () => {
    const input = new JobRequest();
    input.setYaml(FIXTURE_PIPELINE);
    input.setJobId('deploy');
    const result = extractRules(ctx, input);
    expect(result.getRulesList()).toHaveLength(0);
    const only = result.getOnly()!;
    expect(only.getSpecified()).toBe(true);
    expect(only.getRefsList()).toEqual(['main', 'tags']);
  });

  it('reports found=false for an unknown job id', () => {
    const input = new JobRequest();
    input.setYaml(FIXTURE_PIPELINE);
    input.setJobId('nope');
    const result = extractRules(ctx, input);
    expect(result.getFound()).toBe(false);
    expect(result.getError()).toMatch(/not found/);
  });
});
