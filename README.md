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

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/gitlab-ci-tools@0.1.0

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/gitlab-ci-tools/ParsePipeline --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/gitlab-ci-tools/0.1.0/ParsePipeline \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/gitlab-ci-tools/ParsePipeline`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

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
