import { JobRequest } from '../gen/messages_pb';
import { resolveExtends } from './resolve_extends';
import { ctx, FIXTURE_PIPELINE, EXTENDS_CYCLE_PIPELINE } from './testkit';

function req(jobId: string): JobRequest {
  const r = new JobRequest();
  r.setYaml(FIXTURE_PIPELINE);
  r.setJobId(jobId);
  return r;
}

describe('ResolveExtends', () => {
  // Oracle hand-derived from GitLab's documented extends: merge algorithm
  // (https://docs.gitlab.com/ee/ci/yaml/#extends): hash keys deep-merge
  // recursively; array/scalar keys are wholly replaced by the more
  // specific value. Walking build -> .build_template -> .base_job:
  //   .base_job         = {before_script:[echo base-before], variables:{BASE_VAR:base-value}, tags:[docker]}
  //   .build_template   = .base_job (deep-merged) + {image:'node:20', script:[echo build-template-script]}
  //                     = {before_script:[...], variables:{...}, tags:[...], image:'node:20', script:[echo build-template-script]}
  //   build             = .build_template (deep-merged) + {stage:'build', script:[npm run build] (REPLACES), artifacts:{...}}
  //                     = before_script/variables/tags/image inherited unchanged,
  //                       script wholly replaced by build's own, stage+artifacts added.
  it("resolves build's extends chain (.build_template <- .base_job) via GitLab's documented deep-merge rule", () => {
    const result = resolveExtends(ctx, req('build'));
    expect(result.getError()).toBe('');
    expect(result.getFound()).toBe(true);
    expect(result.getExtendsChainList()).toEqual(['.base_job', '.build_template']);

    // Inherited from .base_job, untouched by anything in the chain.
    expect(result.getMergedBeforeScriptList()).toEqual(['echo base-before']);
    expect(result.getMergedVariablesList().map((kv) => [kv.getKey(), kv.getValue()])).toEqual([
      ['BASE_VAR', 'base-value'],
    ]);
    expect(result.getMergedTagsList()).toEqual(['docker']);

    // Inherited from .build_template.
    expect(result.getHasImage()).toBe(true);
    expect(result.getMergedImage()!.getName()).toBe('node:20');

    // build's own script: WHOLLY REPLACES .build_template's script (arrays
    // never concatenate under extends:) — the killing assertion for the
    // merge-not-concat rule.
    expect(result.getMergedScriptList()).toEqual(['npm run build']);

    // build's own scalar/hash keys.
    expect(result.getMergedStage()).toBe('build');
    expect(result.getHasArtifacts()).toBe(true);
    expect(result.getMergedArtifacts()!.getPathsList()).toEqual(['dist/']);
  });

  it('returns an empty chain and the job unchanged when it has no extends:', () => {
    const result = resolveExtends(ctx, req('test'));
    expect(result.getError()).toBe('');
    expect(result.getExtendsChainList()).toEqual([]);
    expect(result.getMergedScriptList()).toEqual(['npm test']);
  });

  it('detects and reports a direct extends: cycle instead of hanging or crashing', () => {
    const r = new JobRequest();
    r.setYaml(EXTENDS_CYCLE_PIPELINE);
    r.setJobId('job_a');
    const result = resolveExtends(ctx, r);
    expect(result.getFound()).toBe(false);
    expect(result.getError()).toMatch(/cycle/);
  });

  it('reports a structured error for an unknown job id', () => {
    const result = resolveExtends(ctx, req('does_not_exist'));
    expect(result.getFound()).toBe(false);
    expect(result.getError()).toMatch(/not found/);
  });

  it('is deterministic across repeated calls', () => {
    const r1 = resolveExtends(ctx, req('build'));
    const r2 = resolveExtends(ctx, req('build'));
    expect(r1.getMergedScriptList()).toEqual(r2.getMergedScriptList());
    expect(r1.getExtendsChainList()).toEqual(r2.getExtendsChainList());
  });
});
