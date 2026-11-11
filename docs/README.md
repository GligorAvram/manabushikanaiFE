# manabushikanaiFE docs

Short, gotcha-first notes about how this app is built — the conventions each area
follows and the non-obvious pitfalls that have actually bitten us. The goal is that
**before designing a feature you skim the relevant docs**, and **when you hit or fix a
non-obvious issue you record it here**, so the next person (or AI session) doesn't
re-learn it the hard way.

Keep every doc **short and scannable**. These are not tutorials or API references —
they capture decisions and traps, not everything.

## Layout

```
docs/
  README.md          ← this file
  architecture.md    ← the data-flow pattern + module/DI/lazy-loading model (read first)
  shared/            ← cross-cutting building blocks (used by every module)
  writer/            ← writer module
  reader/            ← reader module
```

One subfolder per module, a few short topic docs each. A module folder has a
`README.md` that indexes its docs.

## Before you build (checklist)

When planning or designing a feature:

1. Read `architecture.md` (the data-flow + DI model everything follows).
2. Read the `shared/` docs relevant to what you'll touch (data layer, state, tables…).
3. Read the target module's folder (`writer/`, `reader/`, …).
4. Design to match the existing conventions; if you must deviate, say why.
5. **After implementing** — if you hit a non-obvious bug, a surprising framework
   behaviour, or made a decision worth remembering, add a `### Gotcha` entry to the
   closest doc (create the doc if the area has none yet).

## Doc template

```markdown
# <Section>
**Files:** `src/app/...`   **Related:** [other doc](../shared/x.md)

## Conventions
- short bullets of "how we do it here"

## Gotchas
### <one-line title>
- **Symptom:** what you observe
- **Cause:** the real reason
- **Rule:** what to do / avoid next time
- **Ref:** `file.ts:line` or commit hash
```

Gotchas are append-only in spirit: don't delete one unless the underlying cause is
truly gone (e.g. the fragile code was removed). Prefer adding a dated note that it's
resolved.
