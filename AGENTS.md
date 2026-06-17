# AGENTS.md — Venture OS

**Repo:** venture-os — GTCX venture operating system (Next.js app in `app/`).

## Session start

1. Read `README.md` and `docs/README.md`.
2. Run `pnpm install` && `pnpm dev` from repo root.
3. Fleet work selection: `pnpm --dir ../bridge-os agent:next-work` when coordinating with program office.

## Protocols

- **P22** — execute returned story; no story menus.
- **P26** — Proceed Brief then implement.
- **P27** — run gates in-session; report command + exit code.

## Quality gates

```bash
pnpm lint
pnpm dev
```

Conventional commits: `type(scope): subject`.
