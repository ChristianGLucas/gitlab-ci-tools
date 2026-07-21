import { Pipeline } from '../gen/messages_pb';
import { extractIncludes } from './extract_includes';
import { ctx, FIXTURE_PIPELINE, NOT_A_MAPPING_PIPELINE } from './testkit';

describe('ExtractIncludes', () => {
  it('classifies every include: kind: local, project, remote, template, component', () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = extractIncludes(ctx, input);
    expect(result.getError()).toBe('');
    const includes = result.getIncludesList();
    expect(includes).toHaveLength(5);

    expect(includes[0].getKind()).toBe('local');
    expect(includes[0].getLocal()).toBe('/ci/build.yml');

    expect(includes[1].getKind()).toBe('project');
    expect(includes[1].getProject()).toBe('my-group/my-project');
    expect(includes[1].getRef()).toBe('main');
    expect(includes[1].getFile()).toBe('/templates/test.yml');

    expect(includes[2].getKind()).toBe('remote');
    expect(includes[2].getRemote()).toBe('https://example.com/ci-template.yml');

    expect(includes[3].getKind()).toBe('template');
    expect(includes[3].getTemplate()).toBe('Security/SAST.gitlab-ci.yml');

    expect(includes[4].getKind()).toBe('component');
    expect(includes[4].getComponent()).toBe('$CI_SERVER_FQDN/my-group/my-component@1.0');
    expect(includes[4].getInputsList().map((kv) => [kv.getKey(), kv.getValue()])).toEqual([['stage', 'test']]);
  });

  it('treats a bare include: string as local: shorthand', () => {
    const input = new Pipeline();
    input.setYaml('include: /ci/single.yml\nbuild:\n  script:\n    - echo hi\n');
    const result = extractIncludes(ctx, input);
    expect(result.getIncludesList()).toHaveLength(1);
    expect(result.getIncludesList()[0].getKind()).toBe('local');
    expect(result.getIncludesList()[0].getLocal()).toBe('/ci/single.yml');
  });

  it('returns zero includes (not an error) when include: is absent', () => {
    const input = new Pipeline();
    input.setYaml('build:\n  script:\n    - echo hi\n');
    const result = extractIncludes(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getIncludesList()).toHaveLength(0);
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = extractIncludes(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
