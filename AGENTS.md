# AI Agent Governance

This document defines how agents coordinate work in Café Debug.
It is intentionally focused on governance, lifecycle, and handoffs.

## Scope

- Applies to multi-agent workflows under `.github/agents/*`.
- Applies when work moves across phases (spec -> plan -> implementation -> validation -> documentation).
- For direct coding behavior and architecture rules, use `README.md` and `.github/copilot-instructions.md`.

## Read Order

Before non-trivial work:

1. `README.md`
2. relevant docs under `.specs/`
3. `.github/copilot-instructions.md`
4. `AGENTS.md` (required when delegating across agents or coordinating phase handoffs)

## Source-of-Truth Boundaries

| Topic | Source |
| --- | --- |
| Product, architecture, stack decisions | `README.md` |
| Code generation rules and architectural constraints | `.github/copilot-instructions.md` |
| Spec format and delivery lifecycle | `.specs/README.md` |
| Multi-agent orchestration and handoffs | `AGENTS.md` |

## Required Lifecycle

All non-trivial work must follow this sequence:

1. Specification
2. Planning
3. Implementation
4. Debug/validation
5. Documentation

Hard rules:

- Do not skip phases.
- Do not approve partial phase outputs.
- If a phase is incomplete, send work back to the responsible agent.

## Agent Responsibility Model

- **Architect Guardian**: orchestrates the lifecycle and enforces phase order.
- **Spec Writer**: creates/updates implementation-ready specs.
- **Master Planner**: converts approved specs into phased execution tasks.
- **Frontend Blacksmith**: implements according to plan and architecture constraints.
- **The Debugger**: validates correctness, architecture compliance, and edge cases.
- **Documentation Monk**: aligns docs with delivered behavior and architecture.

## Delegation and Handoff Contract

Each delegation must include:

- goal and scope
- relevant files/spec references
- constraints (architecture, design system, skills)
- expected output format

Each handoff must include:

- what changed
- where it changed (paths)
- unresolved risks or blockers
- explicit approval/rejection status

## Enforcement Rules

- If no valid spec exists for non-trivial work, return to spec phase.
- If plan does not map cleanly to spec, return to planning phase.
- If implementation violates architecture or data-flow rules, reject and return for correction.
- If behavior changes, update the relevant spec and docs.

## Definition of Done (Agent Workflow)

- Implementation aligns with approved spec and plan.
- Validation confirms behavior and architectural compliance.
- Documentation reflects final behavior and extension points.
- Guidance references are consistent across `README.md`, `.github/copilot-instructions.md`, and this file.
