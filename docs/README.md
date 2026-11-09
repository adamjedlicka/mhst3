# Knowledge base

This is the durable record for a long-running rewrite. It should be sufficient
for a developer, the business owner, or a new coding-agent conversation to
continue without relying on chat history.

**Current milestone:** technical foundation implemented after the initial
discovery baseline, 2026-11-09. **No business pricing rules have yet been approved
for the rewrite.** See [development setup](DEVELOPMENT.md) for running the app,
and [progress](PROGRESS.md) for evidence and next actions.

## Reading paths

### For the business-owner meeting

1. [Glossary](business/glossary.md): English explanations with the original Czech terms.
2. [Questions](business/questions.md): prioritized decisions and evidence to request.
3. [Scenarios](business/scenarios.md): concrete examples to validate together.
4. [Meeting record template](business/meetings/README.md).

### For implementation and technical discovery

| Document | What it answers |
| --- | --- |
| [Development setup](DEVELOPMENT.md) | Install/run/check commands, local Convex, environment and test isolation |
| [Implementation readiness](IMPLEMENTATION-READINESS.md) | Which decisions/examples block each first slice, and what need not block scaffolding |
| [System map](legacy/system-map.md) | Where the relevant behavior lives, scope boundaries, and major risks |
| [Authentication, projects, and quotes](legacy/auth-projects-quotes.md) | User journeys, permissions, numbering, drafts, and issued revisions |
| [Configurator and pricing](legacy/configurator-pricing.md) | Configuration structure, dimensions, rules, calculation order, and money semantics |
| [Data and integrations](legacy/data-integrations.md) | Persistence shapes, runtime data sources, external dependencies, migration hazards |
| [Validation baseline](legacy/validation.md) | What was tested, what passed, and what remains unverified |
| [Architecture proposal](architecture/README.md) | A small target design and staged implementation plan |
| [Database-managed catalogues](architecture/catalogues.md) | Accepted data/engine boundary; proposed detailed model, editor and publication |
| [Scope and stack decision](decisions/0001-rewrite-boundary-and-stack.md) | What the requester has already selected |
| [Progress](PROGRESS.md) | Status, backlog, blockers, and chronological handoff |

## Evidence conventions

Use these distinctions explicitly:

| Label | Meaning |
| --- | --- |
| **Observed** | Read in the pinned legacy source; not necessarily exercised |
| **Characterized** | Exercised by a named check in the recorded environment |
| **Business-approved** | Confirmed by the owner; link the meeting, person, date, and example |
| **Proposed** | Recommended for the rewrite; not accepted by implication |
| **Unknown** | Evidence or a decision is missing |

An observation can also be characterized without being business-approved.
Older requirements documents, preview HTML, comments, and test titles are
historical evidence, not an alternative source of current truth.

All legacy file/line references in this pass refer to submodule commit
`118bad3b390bf2785be0c16c8fe366fb3ecd2003`. Initialize `old/` before following
them. Recheck citations if that revision changes.

## Keeping this useful

- Update findings alongside changes in understanding. Keep one canonical
  explanation per rule.
- Use stable question IDs (`Q-01`), scenario IDs (`SC-01`), and task IDs
  (`DISC-01`, `BUILD-01`) in discussions, commits, and meeting notes.
- Before a meeting, select a few questions and bring examples. After it, record
  the answer and update the relevant scenario and finding.
- Before a feature, identify its approved scenarios and unresolved assumptions.
  After it, link implementation and tests from the progress board.
- Use a short architectural decision record for a consequential technical
  choice, not a diary entry for every implementation detail.
- Keep sensitive evidence outside Git unless its anonymization and storage
  have been explicitly approved. Record how approved fixtures were derived.
