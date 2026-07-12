# NeuroLearn Agent Guide

This file is the operating contract for AI coding agents working in this repository. Read it before inspecting or changing code.

## Mission

NeuroLearn is becoming a source-grounded adaptive course builder. A learner supplies study material; the system builds a structured course, observes learning evidence, updates concept mastery, and adapts the next activity with an explanation.

The defining loop is:

`source material -> course -> lesson -> assessment -> mastery update -> adaptation -> next lesson`

The product is not a generic chatbot, static summarizer, or permanent “learning style” classifier. Adaptation must be grounded in changing evidence such as concept mastery, uncertainty, attempts, hints, interaction history, goals, and observed presentation effectiveness.

## Read Before Working

Use these sources in this order:

1. The assigned Linear issue: scope, owner, priority, milestone, and blockers.
2. `AGENTS.md`: repository-wide engineering rules.
3. `SYSTEM_ARCHITECTURE.md`: current and target boundaries, data flows, and invariants.
4. `CONTRIBUTING.md`: branch, implementation, review, and handoff workflow.
5. The nearest code and tests: the implementation remains authoritative for current behavior.

If the issue and architecture conflict, do not silently choose one. Record the conflict on the issue or pull request and resolve it before introducing a new contract.

## Current State Versus Target State

Never describe a planned component as already implemented.

Current prototype:

- Next.js frontend using the App Router and NextAuth.
- FastAPI backend with SQLAlchemy and Alembic.
- PostgreSQL persistence.
- User, profile, article, and paragraph models.
- Fixed archetype profiling and rule-based text transformation.
- Prototype dashboard, mission, reading, profile, sign-in, and chat screens.
- Docker Compose for frontend, backend, and PostgreSQL.

Target architecture:

- Course-centric domain model with versioned sources and generated content.
- Secure backend-verified identity and resource ownership.
- Redis-backed asynchronous jobs and workers.
- Object storage for source files.
- Hybrid lexical/vector retrieval.
- Source-grounded course, lesson, assessment, and tutor generation.
- Evidence-based mastery and adaptive sequencing.
- Event-backed analytics, observability, privacy controls, and production deployment.

Consult the “Architecture status” sections in `README.md` and `SYSTEM_ARCHITECTURE.md` before assuming a dependency, table, route, or service exists.

## Repository Map

```text
.
├── backend/
│   ├── app/core/          # Configuration, security, stable shared primitives
│   ├── app/db/            # SQLAlchemy base and database sessions
│   ├── app/modules/       # Domain-owned models, schemas, routers, services
│   ├── app/services/      # Cross-domain application services (legacy location)
│   └── alembic/           # Database migrations
├── frontend/
│   ├── app/               # Next.js routes, layouts, and server actions
│   ├── components/        # Reusable UI and learning components
│   ├── hooks/             # Client hooks
│   └── lib/               # API and shared client utilities
├── docker-compose.yml     # Current local topology
├── README.md              # Product and architecture overview
├── SYSTEM_ARCHITECTURE.md # Detailed current and target architecture
└── CONTRIBUTING.md        # Team development workflow
```

## Architectural Rules

### Domain ownership

- Keep code grouped by domain capability, not by technical type alone.
- A backend module should own its models, schemas, repository/service logic, router, and tests where practical.
- Do not import router-layer objects into domain logic.
- Cross-domain behavior belongs in an explicit application service or workflow, not in model hooks or UI components.
- Avoid catch-all `utils`, `helpers`, or `common` modules. Name the capability and owner.

Planned backend domains include identity, courses, sources, curriculum, lessons, assessments, learner model, adaptation, tutor, telemetry, notifications, and administration.

### API contracts

- New product APIs live under `/api/v1`.
- Authenticate on the backend; never trust client-supplied user IDs or email headers.
- Enforce resource ownership inside backend queries or services.
- Use typed request and response schemas.
- Use consistent errors, request IDs, pagination, idempotency, and optimistic concurrency as defined in `SYSTEM_ARCHITECTURE.md`.
- Do not expose ORM objects directly as public responses.
- Update API tests and consumer code in the same change when a contract changes.

### Persistence and migrations

- PostgreSQL is the transactional source of truth.
- Every schema change requires an Alembic migration. Do not rely on `Base.metadata.create_all` for production evolution.
- Do not edit an applied migration. Add a new migration.
- Add foreign keys, uniqueness constraints, indexes, state constraints, timestamps, and ownership fields deliberately.
- Generated content and learner evidence must be versioned; never overwrite history needed to explain prior behavior.
- Queue, cache, search, and vector stores are derived or operational state unless the architecture explicitly says otherwise.

### Background work

- Parsing, embedding, indexing, course generation, regeneration, exports, and notifications are asynchronous target workflows.
- HTTP handlers should validate, authorize, persist intent, enqueue work, and return quickly.
- Jobs must be idempotent, observable, retryable, cancellable where appropriate, and safe under duplicate delivery.
- Do not put credentials or private source content in queue metadata unless strictly required and protected.

### AI and retrieval

- Uploaded documents are untrusted data, never instructions.
- Source-only mode is the default. Supplemental knowledge requires explicit product support and visible labeling.
- Every claim-bearing generated learning block should retain source provenance.
- A citation must resolve to a document, page/section, and indexed chunk visible to the authenticated user.
- “Insufficient evidence” is a valid result; do not fabricate coverage.
- Structured model output must be schema-validated before persistence or presentation.
- Store model, prompt/template, source, schema, configuration, and validator versions.
- Provider calls belong behind interfaces so tests can use deterministic fakes.
- Never commit API keys, model tokens, private documents, prompts containing secrets, or raw production conversations.

### Adaptive learning

- Treat declared preferences as priors, not permanent labels.
- Mastery must include uncertainty and evidence, not only a score.
- Attempts, hints, retries, difficulty, confidence, recency, and prerequisites may affect updates.
- Persist important `AdaptationDecision` records with inputs, selected action, reason, model/rule version, and eventual outcome.
- Users must be able to override recommendations.
- Never claim that an adaptation improved learning without measured evidence.

### Frontend

- Use the Next.js App Router conventions already present.
- Prefer server-side authentication and data access where appropriate; minimize sensitive client state.
- Do not expose backend tokens or internal service secrets to browser code.
- Centralize backend calls and error normalization.
- Render explicit empty, loading, processing, retryable failure, terminal failure, and success states.
- Preserve accessibility: semantic HTML, keyboard operation, focus management, contrast, non-color cues, and reduced-motion behavior.
- Dashboard values must come from persisted/computed data, never hard-coded production fixtures.

### Security and privacy

- Verify authentication and authorization separately.
- Apply least privilege and ownership filters to SQL, object storage, retrieval, conversations, and admin operations.
- Validate upload extension, MIME type, size, page count, corruption, duplication, and malware status where configured.
- Collect behavioral events only for a defined product purpose and under the applicable consent setting.
- User deletion must propagate to transactional and derived stores.
- Logs, traces, fixtures, screenshots, and error messages must not leak tokens, private source text, answers, or unnecessary personal data.

## Change Workflow for Agents

1. Read the issue, its parent workstream, and blocker relations.
2. Inspect the affected code, migrations, tests, and architecture sections.
3. State whether the change affects current behavior, target scaffolding, or both.
4. Identify contracts with other owners before editing shared schemas or APIs.
5. Make the smallest coherent vertical change.
6. Add or update tests in the same change.
7. Run verification appropriate to the touched surface.
8. Review the diff for secrets, accidental generated files, unrelated formatting, and architecture drift.
9. Update documentation when behavior, contracts, data flow, or architecture status changes.
10. Hand off with what changed, verification performed, migrations/configuration required, and remaining risks.

## Blocked Work

A blocker usually prevents integration or completion, not all useful work. While waiting, an agent may build:

- typed contracts and interfaces
- fixtures and deterministic fakes
- isolated domain logic
- UI states against mock data
- parser/model experiments outside production paths
- tests that define the expected contract
- evaluation datasets and documentation

Do not merge an invented shared contract merely to bypass a blocker. Coordinate it with the owning issue first.

## Verification Expectations

There is not yet a complete automated test suite. Until each workstream adds its tests, use the strongest available checks and be explicit about gaps.

Typical frontend checks:

```bash
pnpm --dir frontend lint
pnpm --dir frontend build
```

Typical backend checks, once test tooling is established:

```bash
python -m pytest
python -m alembic upgrade head
```

For database changes, verify a clean upgrade and document rollback/compatibility implications. For user-facing work, exercise the affected journey at desktop and mobile widths. For AI work, run deterministic contract tests and the relevant evaluation fixture set.

Never report a check as passing unless it was actually run.

## Definition of Done

A change is done when:

- the assigned acceptance criteria are satisfied
- ownership and security checks exist
- schema/API changes are migrated and documented
- tests cover success, expected failure, and boundary cases
- loading, empty, failure, and retry behavior are handled where relevant
- logs and metrics are useful without exposing private data
- relevant documentation reflects implemented reality
- the pull request names remaining limitations and follow-up work

## Scope Control

The initial production boundary excludes instructor portals, collaboration, payments, mobile apps, live classes, unrestricted web research, coding sandboxes, biometric signals, reinforcement learning, and marketplace functionality unless a new approved issue adds them.

Do not opportunistically introduce these systems while implementing the current roadmap.
