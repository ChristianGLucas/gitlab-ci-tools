import { Pipeline } from '../gen/messages_pb';
import { extractCache } from './extract_cache';
import { ctx, FIXTURE_PIPELINE, NOT_A_MAPPING_PIPELINE } from './testkit';

describe('ExtractCache', () => {
  it("extracts test's list-form cache:, omitting jobs with none", () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = extractCache(ctx, input);
    expect(result.getError()).toBe('');
    const list = result.getCachesList();
    expect(list.map((jc) => jc.getJobId())).toEqual(['test']);
    const caches = list[0].getCacheList();
    expect(caches).toHaveLength(1);
    expect(caches[0].getKey()).toBe('modules-$CI_COMMIT_REF_SLUG');
    expect(caches[0].getPathsList()).toEqual(['node_modules/']);
    expect(caches[0].getPolicy()).toBe('pull');
  });

  it('normalizes a single object-form cache: to a one-element list', () => {
    const input = new Pipeline();
    input.setYaml(`
build:
  cache:
    key: single-key
    paths:
      - vendor/
  script:
    - echo hi
`);
    const result = extractCache(ctx, input);
    const list = result.getCachesList();
    expect(list).toHaveLength(1);
    expect(list[0].getCacheList()).toHaveLength(1);
    expect(list[0].getCacheList()[0].getKey()).toBe('single-key');
  });

  it('extracts a files/prefix-derived cache key', () => {
    const input = new Pipeline();
    input.setYaml(`
build:
  cache:
    key:
      files:
        - package-lock.json
      prefix: node
    paths:
      - node_modules/
  script:
    - echo hi
`);
    const result = extractCache(ctx, input);
    const cache = result.getCachesList()[0].getCacheList()[0];
    expect(cache.getKey()).toBe('');
    expect(cache.getKeyFilesList()).toEqual(['package-lock.json']);
    expect(cache.getKeyPrefix()).toBe('node');
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = extractCache(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
