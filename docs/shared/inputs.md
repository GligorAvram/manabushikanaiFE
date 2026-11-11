# Shared · Inputs

**Files:** `src/app/shared/ui/input/*` (esp. `search-dropdown-input.component.ts`)
**Related:** [ui-tables](ui-tables.md)

## Conventions

- `SearchDropdownInputComponent<T extends {id}>` is the reusable "type-to-search + pick
  one" control (Material autocomplete). It writes the chosen value into the bound
  `[control]`, emits `(search)` for the consumer to run the query, and renders the results
  passed back via `[searchResults]`.
- **Min characters before searching** is built in: set `[minSearchLength]="3"`. The
  component then only emits `(search)` once the threshold is met and shows a built-in hint
  (`searchHintTemplate`, `{min}` placeholder) while 0 < typed < min. Don't re-implement
  this gate in the consumer.
- `[valueFn]` chooses what the bound control receives on select (default: `item.id`; pass
  `item => item.name` for name-based flows like tags).
- Outputs: `(search)` (query, gated by min), `(textChange)` (raw text every keystroke),
  `(enter)` (current text on Enter), `(clearOptionsList)`.
- Consumers: add-story-to-collection modal, manage-tags modal, word editor.

## Gotchas

### `(search)` is gated — use `(textChange)` to clear stale results
- **Symptom:** after narrowing a query the old result list lingers once you delete back
  below `minSearchLength` (the "no results" / selectable list is stale).
- **Cause:** with `minSearchLength` set, the component stops emitting `(search)` below the
  threshold, so a consumer that clears its `searchResults` only inside the `(search)`
  handler never gets told to clear.
- **Rule:** track the raw text via `(textChange)` and clear `searchResults` there when
  `text.trim().length < minSearchLength`. `(search)` is only for firing the query.
- **Ref:** `add-story-to-collection-form-modal.component.ts` `onText`.
