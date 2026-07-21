import { Pipeline } from '../gen/messages_pb';
import { extractJobDependencies } from './extract_job_dependencies';
import { ctx, FIXTURE_PIPELINE, FIXTURE_REAL_JOB_IDS_ORACLE, NOT_A_MAPPING_PIPELINE } from './testkit';

describe('ExtractJobDependencies', () => {
  it('extracts the needs: edge list, including a cross-pipeline edge whose target is outside job_ids', () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = extractJobDependencies(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getJobIdsList()).toEqual(FIXTURE_REAL_JOB_IDS_ORACLE);

    const edges = result.getEdgesList().map((e) => [e.getJobId(), e.getDependsOn()]);
    expect(edges).toEqual(
      expect.arrayContaining([
        ['test', 'build'],
        ['deploy', 'build'],
        ['deploy', 'test'],
        ['cross_pipeline_job', 'upstream_build'],
      ]),
    );
    expect(edges).toHaveLength(4);
    // The cross-pipeline target is not a job in this document.
    expect(result.getJobIdsList()).not.toContain('upstream_build');
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = extractJobDependencies(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
