# Shared · Lists & tables

**Files:** `src/app/shared/ui/story-list-table.component.ts`, `collection-list-table.component.ts`, `tag-chip-list.component.ts`
**Related:** [state](state.md)

## Conventions

- List tables are standalone `OnPush` components taking the rows as an `@Input`
  (`stories` / `collections`) and binding `[dataSource]="rows"` on a raw array.
- They expose optional tag inputs/outputs: `showTags`, `manageableTags`, `clickableTags`,
  `onManageTags`, `onTagClick`, plus a conditional `tags` column.
- Row data comes from a `data.service` `data$` (`combineLatest`), so each store change
  emits a new object with new array references.

## Gotchas

### `mat-table` with a raw array only re-renders on a **new array reference**
- **Symptom:** list doesn't visually update after a mutation.
- **Cause:** `mat-table`'s `dataSource` setter re-renders when the reference changes; it
  does **not** observe in-place mutation of the same array.
- **Rule:** store handlers must return new arrays (`.map`/`.filter`/spread), never mutate.
  This is already the convention in [state](state.md) — if a list looks stale, first
  confirm the store actually updated (a swallowed handler exception will leave the old
  reference in place; see [data-layer](data-layer.md)).
- **Ref:** `story-list-table.component.ts`, `writer-tag-list-page.component.ts`.

### Interactive cells inside a clickable row
- **Rule:** when a row has `(click)` navigation and a cell has its own buttons (manage
  tags, delete…), stop propagation on that cell: `(click)="$event.stopPropagation()"`.
