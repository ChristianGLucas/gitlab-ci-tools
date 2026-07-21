// Shared test context and fixture pipelines for gitlab-ci-tools node unit
// tests. Not a node and not a test file (no describe/it), so it is neither
// registered as a node nor collected by jest.
import { AxiomContext, AxiomLogger, AxiomSecrets, AxiomReflection, AxiomMutation } from '../gen/axiomContext';

const reflection: AxiomReflection = {
  flow: {
    nodes: [],
    edges: [],
    loopEdges: [],
    position: { currentInstance: 0, depth: 0, loopIterations: {}, subflowStackGraphIds: [] },
    graphId: '',
  },
};

const mutation: AxiomMutation = {
  flow: {
    addNode: (_p: string, _v: string) => 0,
    addEdge: (_s: number, _d: number) => {},
  },
};

export const ctx: AxiomContext = {
  log: { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} } satisfies AxiomLogger,
  secrets: { get: (_n: string): [string, boolean] => ['', false] } satisfies AxiomSecrets,
  executionId: 'test-execution-id',
  flowId: 'test-flow-id',
  tenantId: 'test-tenant-id',
  reflection,
  mutation,
};

/**
 * FIXTURE — a hand-authored pipeline exercising every field this package
 * extracts: an explicit stages: list, global variables:/image:/services:,
 * every include: kind (local/project/remote/template/component), two
 * hidden/template jobs chained through extends: (.base_job <- .build_
 * template), a real job (build) that extends the template chain, a job
 * (test) with rules:, a list-form cache:, an object-form needs: entry, and
 * a per-job services: override, a job (deploy) with only:, when: manual,
 * allow_failure with exit_codes, and a per-job image: override, and a job
 * (cross_pipeline_job) with a cross-pipeline needs: entry (pipeline:/job:)
 * that must NOT be flagged as an unknown-job validation issue.
 *
 * Every oracle constant below was derived by hand-applying GitLab's
 * DOCUMENTED semantics to this exact YAML text (the stages: default/
 * implicit-.pre/.post rule and the extends: deep-merge rule, both per
 * https://docs.gitlab.com/ee/ci/yaml/) — never by running this package's
 * own nodes and copying their output. That is the independent oracle: the
 * spec's algorithm, worked out on paper, not this codebase's own answer.
 */
export const FIXTURE_PIPELINE = `
stages:
  - build
  - test
  - deploy

variables:
  GLOBAL_VAR: "global-value"
  DEPLOY_ENV: "staging"

image: ruby:3.2

services:
  - postgres:14

include:
  - local: '/ci/build.yml'
  - project: 'my-group/my-project'
    ref: main
    file: '/templates/test.yml'
  - remote: 'https://example.com/ci-template.yml'
  - template: 'Security/SAST.gitlab-ci.yml'
  - component: '$CI_SERVER_FQDN/my-group/my-component@1.0'
    inputs:
      stage: test

.base_job:
  before_script:
    - echo base-before
  variables:
    BASE_VAR: base-value
  tags:
    - docker

.build_template:
  extends: .base_job
  image: node:20
  script:
    - echo build-template-script

build:
  extends: .build_template
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: "1 week"
    reports:
      junit: report.xml

test:
  stage: test
  needs:
    - job: build
      artifacts: true
  services:
    - redis:7-alpine
  script:
    - npm test
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: always
    - if: '$CI_COMMIT_BRANCH == "main"'
      changes:
        - "src/**/*"
  cache:
    - key: modules-$CI_COMMIT_REF_SLUG
      paths:
        - node_modules/
      policy: pull

deploy:
  stage: deploy
  needs: ["build", "test"]
  image: python:3.11
  script:
    - ./deploy.sh
  only:
    refs:
      - main
      - tags
  when: manual
  allow_failure:
    exit_codes:
      - 137

cross_pipeline_job:
  stage: test
  needs:
    - pipeline: $UPSTREAM_PIPELINE_ID
      job: upstream_build
  script:
    - echo cross
`;

export const FIXTURE_REAL_JOB_IDS_ORACLE = ['build', 'test', 'deploy', 'cross_pipeline_job'];
export const FIXTURE_HIDDEN_JOB_IDS_ORACLE = ['.base_job', '.build_template'];
export const FIXTURE_STAGES_ORACLE = ['.pre', 'build', 'test', 'deploy', '.post'];

/** Minimal valid pipeline — no explicit stages: (exercises the default
 * ["build","test","deploy"] + implicit .pre/.post), one job. */
export const MINIMAL_PIPELINE = `
build:
  stage: build
  script:
    - echo hi
`;

/** stages: explicitly (and out-of-order) includes .pre/.post — exercises
 * that they are always forced to front/back regardless of declared
 * position, with the middle ones deduplicated in their given order. */
export const STAGES_WITH_EXPLICIT_PRE_POST = `
stages:
  - build
  - .pre
  - test
  - .post
  - deploy
`;

/** Structurally invalid: an undeclared stage, a needs: reference to a
 * nonexistent job, and an extends: reference to a nonexistent template. */
export const INVALID_PIPELINE = `
stages:
  - build
  - deploy

bad_job:
  stage: test
  needs:
    - nonexistent_job
  extends: .missing_template
  script:
    - echo hi
`;

/** A direct two-job extends: cycle. */
export const EXTENDS_CYCLE_PIPELINE = `
job_a:
  extends: job_b
  script:
    - echo a

job_b:
  extends: job_a
  script:
    - echo b
`;

export const NOT_A_MAPPING_PIPELINE = `- just
- a
- list
`;

export const UNPARSEABLE_YAML = `
build:
  stage: build
 script:
    - echo hi
`;
