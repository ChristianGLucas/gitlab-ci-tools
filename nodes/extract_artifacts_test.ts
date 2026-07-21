import { Pipeline } from '../gen/messages_pb';
import { extractArtifacts } from './extract_artifacts';
import { ctx, FIXTURE_PIPELINE, NOT_A_MAPPING_PIPELINE } from './testkit';

describe('ExtractArtifacts', () => {
  it("extracts build's artifacts: block, omitting jobs with none", () => {
    const input = new Pipeline();
    input.setYaml(FIXTURE_PIPELINE);
    const result = extractArtifacts(ctx, input);
    expect(result.getError()).toBe('');
    const list = result.getArtifactsList();
    expect(list.map((ja) => ja.getJobId())).toEqual(['build']);
    const artifacts = list[0].getArtifacts()!;
    expect(artifacts.getPathsList()).toEqual(['dist/']);
    expect(artifacts.getExpireIn()).toBe('1 week');
    expect(artifacts.getReportsList().map((kv) => [kv.getKey(), kv.getValue()])).toEqual([['junit', 'report.xml']]);
  });

  it('returns a structured error for a document that is not a mapping', () => {
    const input = new Pipeline();
    input.setYaml(NOT_A_MAPPING_PIPELINE);
    const result = extractArtifacts(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
