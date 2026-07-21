import { Pipeline } from '../gen/messages_pb';
import { validatePipeline } from './validate_pipeline';
import { ctx, FIXTURE_PIPELINE, INVALID_PIPELINE, NOT_A_MAPPING_PIPELINE } from './testkit';

describe('ValidatePipeline', () => {
  it('reports valid=true for a structurally sound pipeline (cross-pipeline needs skipped)', () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = validatePipeline(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getIssuesList().map((i) => i.getMessage())).toEqual([]);
    expect(result.getValid()).toBe(true);
  });

  it('reports every violation: undeclared stage, unknown needs target, unknown extends target', () => {
    const input = new Pipeline();
    input.setYaml(INVALID_PIPELINE);
    const result = validatePipeline(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getValid()).toBe(false);
    const messages = result.getIssuesList().map((i) => i.getMessage());
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.stringContaining('stage "test" is not declared'),
        expect.stringContaining('needs references unknown job "nonexistent_job"'),
        expect.stringContaining('extends references unknown job ".missing_template"'),
      ]),
    );
    expect(result.getIssuesList()).toHaveLength(3);
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = validatePipeline(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
