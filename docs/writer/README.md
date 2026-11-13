# Writer module

Writer-side features (authoring stories, collections, tags). Follows the standard
[data-flow pattern](../architecture.md); `WriterDataModule` provides the store/queries/
actions/api service.

## Docs

- [tags.md](tags.md) — tags on stories & collections, writer tag admin page.

## Conventions specific to writer

- Feature pages live under `writer/features/<page>/` as a 4-file set: component, module,
  routing module, `*-data.service.ts`.
- Most pages are routed under a shell (`writer-shell`, `writer-collection-shell`); some
  (e.g. the tag admin page) are lazy-loaded directly from `secure-routing`.
- Standalone modal components enter the build graph by being referenced from an in-graph
  component's `.ts`; an orphan standalone component is **not** type-checked by the build.
- Primary "create" actions (Add story / collection / tag) live in the `app-header`
  **`[headerRight]`** slot (right-aligned next to the title), not floating between the
  header and the table. On the tag page, the search box sits in a separate toolbar row
  below — create vs. filter are kept apart.

## Visual redesign (reader palette)

- The writer pages now follow the reader "washi paper + indigo" language via the design
  tokens and the global Material overrides — see [styling.md](../shared/styling.md)
  (Material theming section). Writer modals/tables/buttons inherit their look from the
  shared primitives + those global overrides, so prefer fixing the shared piece over
  per-page CSS.
- The two translation editors (`sentence-editor`, `word-editor`) were reworked from the
  old `mat-card` stacks into a **source-text card + two-column (list / edit) grid + footer
  action** layout, built from native token-styled elements (the editing/selection/drag
  logic is unchanged). The paragraph stepper lives in a bordered `.editor-panel` on the
  story-details page, with the Word/Sentence `app-slider` moved into the page header.

Add a new topic doc here when a writer feature has conventions or gotchas worth keeping.

## Gotchas

### Template `!` (non-null assertion) does not guard at runtime
- **Symptom:** opening a story with no translations yet throws
  `TypeError: can't access property "paragraphs", data.paragraphs is null` in the console.
- **Cause:** the story-details stepper iterated `data.paragraphs!.paragraphs`. The `!`
  only silences the TS compiler; at runtime `data.paragraphs` is `null` (no paragraphs
  loaded) so `.paragraphs` throws.
- **Rule:** in templates use safe navigation (`?.`), never `!`, on data that can be
  null/undefined. `*ngFor` over `null`/`undefined` is fine — it renders nothing.
- **Ref:** `writer/features/writer-story-details-page/writer-story-details-page.component.ts:38`

### `app-search-dropdown-input` display must be driven per-selection, not via `[initialValue]`
- **Symptom:** in the word editor, the translation dropdown kept showing a previous word's
  translation when you selected a word that had none (and after choosing a translation,
  switching words lost/overwrote it).
- **Cause:** the dropdown keeps the *visible* text in its own internal `searchControl`,
  separate from the bound form `control`. Feeding it through `[initialValue]` + `ngOnChanges`
  is unreliable: `ngOnChanges` does **not** re-run when the bound value stays the same
  reference (e.g. `undefined → undefined` when switching between two un-translated words), so
  stale text sticks. (It was also originally computed from the **backend** `paragraph.words`,
  which never reflects in-session edits.)
- **Rule:** each row stores the picked `DictionaryWordDto` (`EditableWordTranslation.dictionaryWord`),
  captured via the dropdown's `(optionSelected)` output. On `setAsSelectedWord` the editor
  pushes it into the dropdown **imperatively** via `@ViewChild` → `showSelection(word.dictionaryWord)`
  (clears the box when `undefined`). This bypasses change-detection reference checks, so every
  selection — including two empty ones in a row — updates the box. `showSelection` touches only
  the display; the parent still owns the bound `control`.
- **Deselect:** emptying the search box is treated as "no translation" — `(textChange)` with
  blank text clears the form control *and* the row's stored `dictionaryWord`/`dictionaryWordId`,
  so the removed translation does not reappear when switching away and back.
- **Deselect the whole word:** a plain click in the paragraph (no text selected) and deleting
  the selected word both run `deselectWord()`, which nulls the selection, clears the form, and
  clears the dropdown display. `removeWord` also shifts `selectedIndex` down when an earlier word
  is deleted so the edit box keeps pointing at the same word.
- **Blur reverts uncommitted text (opt-in):** with `[revertOnBlur]="true"` the dropdown caches
  the committed selection's display text (`lastCommittedDisplay`) and, on blur, reverts the box
  to it (or to empty if nothing is committed), so typing free text and clicking away without
  picking an option does not leave a never-selected translation showing. It is **off by default**
  because the tag/collection modals use the typed text as free input (type-a-name + Add) and must
  keep what was typed. The cache is kept in sync by `onSelect`, `showSelection`, the empty-input
  path, and `clear()`.
- **Ref:** `writer/ui/word-editor.component.ts`, `shared/ui/input/search-dropdown-input.component.ts`
