import { Pipeline } from '../gen/messages_pb';
import { extractImages } from './extract_images';
import { ctx, FIXTURE_PIPELINE, NOT_A_MAPPING_PIPELINE } from './testkit';

describe('ExtractImages', () => {
  it('extracts the global image/services and each job override, omitting jobs with neither', () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = extractImages(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getHasGlobalImage()).toBe(true);
    expect(result.getGlobalImage()!.getName()).toBe('ruby:3.2');
    expect(result.getGlobalServicesList()).toHaveLength(1);
    expect(result.getGlobalServicesList()[0].getName()).toBe('postgres:14');

    const jobImages = result.getJobImagesList();
    // Only `test` (services override) and `deploy` (image override)
    // declare their own image:/services: — build/cross_pipeline_job don't.
    expect(jobImages.map((ji) => ji.getJobId()).sort()).toEqual(['deploy', 'test']);

    const testEntry = jobImages.find((ji) => ji.getJobId() === 'test')!;
    expect(testEntry.getHasImage()).toBe(false);
    expect(testEntry.getServicesList()[0].getName()).toBe('redis:7-alpine');

    const deployEntry = jobImages.find((ji) => ji.getJobId() === 'deploy')!;
    expect(deployEntry.getHasImage()).toBe(true);
    expect(deployEntry.getImage()!.getName()).toBe('python:3.11');
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = extractImages(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
