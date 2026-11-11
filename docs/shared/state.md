# Shared · State (Elf store + persistence)

**Files:** `src/app/shared/data/store.models.ts` (`BaseStore`), each module's `*.store.ts`
**Related:** [data-layer](data-layer.md)

## Conventions

- `BaseStore` wraps an Elf store and **persists state to `sessionStorage`** keyed by the
  store name (`StoreNameEnum`). State survives reloads and is restored on store creation.
- Mutations go through `update()` and must be **immutable** — always produce new arrays/
  objects (`.map`, `.filter`, spreads). The view layer (and `mat-table`) relies on
  reference changes to re-render; see [ui-tables](ui-tables.md).
- Multiple lazy feature modules can each create their own instance of a module's store;
  they share one persistence key, so instances can load each other's last persisted state.

## Gotchas

### Restored state can be missing keys or hold non-array values — guard before `.map`
- **Symptom:** `TypeError: (intermediate value).map is not a function` thrown inside a
  store handler (then swallowed — see [data-layer](data-layer.md)), so the update never
  applies. Happens on a page that never loads a given slice (e.g. the tags page never
  loads `stories`/`collections`).
- **Cause:** persisted `sessionStorage` state drifts across app versions / across store
  instances. A slice the current page never populates can come back `undefined` **or a
  non-array value**. `x ?? []` only catches null/undefined — a non-array truthy value
  still breaks `.map`.
- **Rule:** in store handlers, never assume a slice is an array. Normalize with an
  `Array.isArray` guard before iterating:
  ```ts
  private asArray<T>(v: unknown): T[] { return Array.isArray(v) ? v as T[] : []; }
  // ...
  stories: this.asArray<StoryDto>(state.stories).map(...)
  ```
  Use this for every array touched by a handler, including nested ones (`s.tags`).
- **Ref:** `writer.store.ts` tag handlers (`onTagUpdated`, `onTagDeleted`, …).

### `sessionStorage` shape drift after you change a state interface
- **Symptom:** odd restored values (stale slices, old shapes) only in a browser that has
  used an older build; a fresh/incognito session looks fine.
- **Cause:** persisted JSON is from a previous state shape and is restored as-is.
- **Rule:** don't trust restored state's shape (guard as above). When debugging a "only on
  my machine" state bug, clear the store's `sessionStorage` key to rule drift in/out.
