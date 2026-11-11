# manabushikanaiFE — working notes for AI sessions

Angular frontend, split into `writer` / `reader` / `shared` modules mirroring the backend.

## Project docs — read before designing, update after discovering

The `docs/` folder holds short, gotcha-first notes on how each area is built and the
non-obvious traps in it. It is the source of truth for conventions and known issues.

**When planning or designing a feature, first read:**
1. `docs/architecture.md` — the data-flow + DI/lazy-loading model everything follows.
2. The relevant `docs/shared/*` docs for the building blocks you'll touch
   (`data-layer.md`, `state.md`, `ui-tables.md`).
3. The target module's folder (`docs/writer/`, `docs/reader/`, …).

Factor the conventions and listed gotchas into the design. If a design must deviate from
them, call that out explicitly.

**After implementing**, if you hit a non-obvious bug, a surprising framework behaviour, or
made a decision worth remembering, append a `### Gotcha` entry (using the template in
`docs/README.md`) to the closest doc — create the topic doc if the area has none. Keeping
`docs/` current is part of finishing the task, not optional.

See `docs/README.md` for the layout, the template, and the full "before you build"
checklist.

## Build check

`npx ng build --configuration development` should pass clean. Note: orphan standalone
components (not referenced from an in-graph component) are **not** type-checked by the
build — pull a new standalone component into the graph before relying on the build to
check its template.
