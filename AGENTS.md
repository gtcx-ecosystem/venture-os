# AGENTS.md — Venture OS

**Repo:** venture-os — GTCX venture operating system (Next.js app in `app/`).

## Protocols

Protocol 22 (work selection — **delegated to bridge-os**), Protocol 24, Protocol 26, Protocol 27, Protocol 28 in force.

**Phase 5.4:** Run `pnpm agent:next-work` before substantive work. **Authority class** R/A/S per Protocol 28.

**Never ask the operator to choose** among backlog items when P22 returns a story.

```bash
pnpm agent:next-work
pnpm agent:work-selection:check
pnpm ops:check
```

## Quality gates

```bash
pnpm test
pnpm lint
pnpm build
```

## Scope

Product app in `app/` · Roadmap `pm/execution-roadmap.md` · Product docs `docs/product/`.
