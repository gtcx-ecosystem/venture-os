# config/ — toolchain, standards pins, baseline runtime

**Standards SoR:** [canon-os](../canon-os/config/ecosystem-central-sor.json) — `writes: false`; resolve, never fork.

## Canon standards pins

See [`config/canon-os-consumption.json`](./canon-os-consumption.json).

| Gate | Command |
|------|---------|
| Repo provisioning | `pnpm repo:provision:check` |
| Docs IA | `pnpm docs:ia:check` |
| Canon contracts | `pnpm canon:contracts:check` |
