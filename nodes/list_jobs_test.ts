import { Pipeline } from '../gen/messages_pb';
import { listJobs } from './list_jobs';
import { ctx, FIXTURE_PIPELINE, FIXTURE_REAL_JOB_IDS_ORACLE, NOT_A_MAPPING_PIPELINE } from './testkit';

describe('ListJobs', () => {
  it('lists every real job with name/stage/script/needs/rules, excluding reserved keys and hidden jobs', () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = listJobs(ctx, input);
    expect(result.getError()).toBe('');

    const ids = result.getJobsList().map((j) => j.getJobId());
    expect(ids).toEqual(FIXTURE_REAL_JOB_IDS_ORACLE);
    // Reserved top-level keywords present in the fixture must never be
    // mistaken for jobs.
    for (const reserved of ['stages', 'variables', 'image', 'services', 'include']) {
      expect(ids).not.toContain(reserved);
    }
    // Hidden/template jobs must never appear here either.
    expect(ids).not.toContain('.base_job');
    expect(ids).not.toContain('.build_template');

    const test = result.getJobsList().find((j) => j.getJobId() === 'test')!;
    expect(test.getStage()).toBe('test');
    expect(test.getScriptList()).toEqual(['npm test']);
    expect(test.getNeedsList()).toHaveLength(1);
    expect(test.getNeedsList()[0].getJob()).toBe('build');
    expect(test.getNeedsList()[0].getArtifacts()).toBe(true);
    expect(test.getRulesList()).toHaveLength(2);
    expect(test.getRulesList()[0].getIfCondition()).toBe('$CI_PIPELINE_SOURCE == "merge_request_event"');
    expect(test.getRulesList()[0].getWhen()).toBe('always');
    expect(test.getRulesList()[1].getChangesList()).toEqual(['src/**/*']);

    const deploy = result.getJobsList().find((j) => j.getJobId() === 'deploy')!;
    expect(deploy.getWhen()).toBe('manual');
    expect(deploy.getNeedsList().map((n) => n.getJob())).toEqual(['build', 'test']);
    expect(deploy.getNeedsList()[0].getIsSimple()).toBe(true);
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = listJobs(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
