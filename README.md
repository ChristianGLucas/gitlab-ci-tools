# gitlab-ci-tools

Deterministic, **GitLab-CI-semantic** parsing and structural inspection of
`.gitlab-ci.yml` pipeline configuration files — built for the
[Axiom](https://axiomide.com) marketplace, handle `christiangeorgelucas`.

This is deliberately distinct from generic YAML/JSON conversion (see
[`dataformat-tools`](https://github.com/ChristianGLucas/dataformat-tools)),
from other config-file packages (`config-tools`, `dockerfile-tools`,
`k8s-manifest-tools`), and from
[`github-actions-tools`](https://github.com/ChristianGLucas/github-actions-tools)
(a *different* CI/CD system with its own schema): this package understands
the GitLab CI pipeline schema — `stages:`/`jobs:`/`needs:`/`rules:`/
`extends:`/`include:` — and pulls out exactly what a CI/CD-auditing agent
needs, rather than converting text between formats.

The pipeline file is always supplied as text by the caller — there is no
GitLab API call, no git checkout, no network, no wall-clock, and no
randomness. Every node is a pure, deterministic function of its input.

## Nodes

- **ParsePipeline** — top-level overview: effective stage order, a brief
  per-job summary, and top-level flags (`variables:`/`default:`/
  `workflow:`/`include:` presence).
- **ListJobs** — every real job's full attribute set (stage, script, needs,
  rules, when) — correctly excluding reserved top-level keywords and
  hidden/template jobs.
- **ListStages** — the effective stage order, including the always-implicit
  `.pre`/`.post` stages GitLab adds regardless of declaration.
- **GetJobConfig** — one job's full raw config (script, before/after_script,
  image, services, variables, artifacts, cache, rules, only/except, needs,
  extends, tags, when, allow_failure).
- **ExtractJobDependencies** — the `needs:` graph as an edge list.
- **ExtractStageDAG** — the stage-ordering DAG: which real jobs run in which
  stage, in effective order.
- **ExtractRules** — one job's `rules:`/`only:`/`except:` conditions in
  full.
- **ExtractIncludes** — every `include:` directive, classified
  (local/project/remote/template/component). Never fetches — report only.
- **ExtractVariables** — the global and every job-level `variables:` block.
- **ExtractImages** — every container image referenced (global + per-job
  `image:`/`services:`) for supply-chain auditing.
- **ExtractArtifacts** — every job's `artifacts:` declaration.
- **ExtractCache** — every job's `cache:` declaration(s) (single or list
  form, normalized).
- **ResolveExtends** — resolves a job's `extends:` chain via GitLab's
  documented deep-merge rule (hash keys merge recursively; array/scalar
  keys are wholly replaced by the more specific value). Detects cycles.
- **GetJobsByStage** — every real job assigned to a given stage.
- **DetectHiddenJobs** — hidden/template job keys (names starting with
  `.`).
- **SummarizePipeline** — job/stage/include/variable counts.
- **ValidatePipeline** — basic structural correctness: job stages are
  declared, `needs:`/`extends:` targets exist. Reports every violation
  found.

## Implementation

Parsing is done with [`js-yaml`](https://github.com/nodeca/js-yaml) (MIT),
using its default `CORE_SCHEMA` — safe by construction, since js-yaml v4+
has no tag capable of constructing an arbitrary JS object or executing code
(no `!!js/function`, no `!!js/regexp`). Explicit `maxDepth`/`maxAliases`
bounds are set on every parse call as defense-in-depth, on top of this
package's own 2 MB byte-size ceiling. All GitLab-CI-pipeline-schema
knowledge (reserved top-level keywords vs. jobs, the `stages:` default +
implicit `.pre`/`.post` rule, the `needs:`/`rules:`/`cache:`/`extends:`
grammars) is this package's own code — not a wrapped GitLab client.

A pipeline file is a single YAML document; a malformed or oversized
document returns a structured error, never a crash.

`ResolveExtends` implements GitLab's documented `extends:` merge algorithm
directly (https://docs.gitlab.com/ee/ci/yaml/#extends): hash-valued keys
deep-merge recursively key by key; array-valued and scalar keys are wholly
replaced by the more specific value (never concatenated). Multiple extends
targets apply in listed order; the job's own keys always win.

## License

MIT — see [LICENSE](LICENSE).
