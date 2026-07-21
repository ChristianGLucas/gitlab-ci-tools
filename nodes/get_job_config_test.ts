import { JobRequest } from '../gen/messages_pb';
import { getJobConfig } from './get_job_config';
import { ctx, FIXTURE_PIPELINE, NOT_A_MAPPING_PIPELINE } from './testkit';

function req(jobId: string): JobRequest {
  const r = new JobRequest();
  r.setYaml(FIXTURE_PIPELINE);
  r.setJobId(jobId);
  return r;
}

describe('GetJobConfig', () => {
  it("extracts test's own raw config: script, services, cache (list form), rules, needs (object form)", () => {
    const result = getJobConfig(ctx, req('test'));
    expect(result.getError()).toBe('');
    expect(result.getFound()).toBe(true);
    expect(result.getStage()).toBe('test');
    expect(result.getScriptList()).toEqual(['npm test']);
    expect(result.getHasImage()).toBe(false); // no image: on `test` itself (extends: is not resolved here)
    expect(result.getServicesList()).toHaveLength(1);
    expect(result.getServicesList()[0].getName()).toBe('redis:7-alpine');
    expect(result.getHasArtifacts()).toBe(false);

    const cache = result.getCacheList();
    expect(cache).toHaveLength(1);
    expect(cache[0].getKey()).toBe('modules-$CI_COMMIT_REF_SLUG');
    expect(cache[0].getPathsList()).toEqual(['node_modules/']);
    expect(cache[0].getPolicy()).toBe('pull');

    const rules = result.getRulesList();
    expect(rules).toHaveLength(2);
    expect(rules[0].getIfCondition()).toBe('$CI_PIPELINE_SOURCE == "merge_request_event"');
    expect(rules[0].getWhen()).toBe('always');
    expect(rules[1].getChangesList()).toEqual(['src/**/*']);

    const needs = result.getNeedsList();
    expect(needs).toHaveLength(1);
    expect(needs[0].getJob()).toBe('build');
    expect(needs[0].getIsSimple()).toBe(false);
    expect(needs[0].getArtifacts()).toBe(true);
    expect(needs[0].getArtifactsSpecified()).toBe(true);
  });

  it("extracts deploy's own raw config: image override, only:, when: manual, allow_failure with exit_codes", () => {
    const result = getJobConfig(ctx, req('deploy'));
    expect(result.getError()).toBe('');
    expect(result.getStage()).toBe('deploy');
    expect(result.getHasImage()).toBe(true);
    expect(result.getImage()!.getName()).toBe('python:3.11');
    expect(result.getNeedsList().map((n) => n.getJob())).toEqual(['build', 'test']);
    expect(result.getNeedsList()[0].getIsSimple()).toBe(true);

    const only = result.getOnly()!;
    expect(only.getSpecified()).toBe(true);
    expect(only.getRefsList()).toEqual(['main', 'tags']);
    expect(result.getExcept()!.getSpecified()).toBe(false);

    expect(result.getWhen()).toBe('manual');
    const af = result.getAllowFailure()!;
    expect(af.getSpecified()).toBe(true);
    expect(af.getAllowed()).toBe(false);
    expect(af.getExitCodesList()).toEqual([137]);
  });

  it("extracts build's own raw artifacts (paths/expire_in/reports), without resolving extends", () => {
    const result = getJobConfig(ctx, req('build'));
    expect(result.getError()).toBe('');
    // build's own script overrides what .build_template declares; extends
    // itself is reported but not merged (ResolveExtends does that).
    expect(result.getScriptList()).toEqual(['npm run build']);
    expect(result.getExtendsList()).toEqual(['.build_template']);
    expect(result.getHasArtifacts()).toBe(true);
    const artifacts = result.getArtifacts()!;
    expect(artifacts.getPathsList()).toEqual(['dist/']);
    expect(artifacts.getExpireIn()).toBe('1 week');
    expect(artifacts.getReportsList().map((kv) => [kv.getKey(), kv.getValue()])).toEqual([['junit', 'report.xml']]);
  });

  it('reports found=false and a structured error for an unknown job id', () => {
    const result = getJobConfig(ctx, req('does_not_exist'));
    expect(result.getFound()).toBe(false);
    expect(result.getError()).toMatch(/not found/);
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const r = new JobRequest();
    r.setYaml(NOT_A_MAPPING_PIPELINE);
    r.setJobId('build');
    const result = getJobConfig(ctx, r);
    expect(result.getError()).not.toBe('');
  });
});
