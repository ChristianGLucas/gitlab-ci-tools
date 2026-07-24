import { Pipeline } from '../gen/messages_pb';
import { parsePipeline } from './parse_pipeline';
import {
  ctx,
  FIXTURE_PIPELINE,
  FIXTURE_REAL_JOB_IDS_ORACLE,
  FIXTURE_STAGES_ORACLE,
  MINIMAL_PIPELINE,
  NOT_A_MAPPING_PIPELINE,
  UNPARSEABLE_YAML,
} from './testkit';

describe('ParsePipeline', () => {
  it('parses effective stages, real-job briefs, and top-level flags', () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = parsePipeline(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getStagesList()).toEqual(FIXTURE_STAGES_ORACLE);
    expect(result.getHasVariables()).toBe(true);
    expect(result.getHasDefault()).toBe(false);
    expect(result.getHasWorkflow()).toBe(false);
    expect(result.getHasInclude()).toBe(true);

    const jobs = result.getJobsList();
    expect(jobs.map((j) => j.getJobId())).toEqual(FIXTURE_REAL_JOB_IDS_ORACLE);
    // Hidden jobs (.base_job, .build_template) must NOT appear.
    expect(jobs.map((j) => j.getJobId())).not.toContain('.base_job');

    const build = jobs.find((j) => j.getJobId() === 'build')!;
    expect(build.getStage()).toBe('build');
    expect(build.getHasScript()).toBe(true);
    expect(build.getScriptLineCount()).toBe(1);
  });

  it('uses GitLab default stages + implicit .pre/.post when stages: is absent', () => {
    const input = new Pipeline();
    input.setYaml(MINIMAL_PIPELINE);
    const result = parsePipeline(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getStagesList()).toEqual(['.pre', 'build', 'test', 'deploy', '.post']);
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = parsePipeline(ctx, input);
    expect(result.getError()).not.toBe('');
    expect(result.getJobsList()).toHaveLength(0);
  });

  it('returns a structured error for unparseable YAML, never a crash', () => {
    const input = new Pipeline();
    input.setYaml(UNPARSEABLE_YAML);
    const result = parsePipeline(ctx, input);
    expect(result.getError()).not.toBe('');
  });

  it('is deterministic across repeated calls on the same input', () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const r1 = parsePipeline(ctx, input);
    const r2 = parsePipeline(ctx, input);
    expect(r1.getJobsList().map((j) => j.getJobId())).toEqual(r2.getJobsList().map((j) => j.getJobId()));
  });
});
