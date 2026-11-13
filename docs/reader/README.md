# Reader module

Reader-side features (browsing published stories and collections).
Follows the standard [data-flow pattern](../architecture.md); `ReaderDataModule` provides
the store/queries/actions/api service.

## Docs

- [word-popup.md](word-popup.md) — the click-to-reveal cards for words & sentences (shared `app-info-popup-card`, CDK overlay).
- [../shared/styling.md](../shared/styling.md) — design tokens, fonts, and the reader "paper" visual theme.

## UI redesign (reader)

- **Story / collection lists** (`ui/story-list-card`, `ui/collection-list-card`):
  responsive card grids with cover, difficulty pill, tags, origin / story count.
- **Reading view** (`features/reader-story-details-page`): a **Word / Sentence** toggle
  (the shared `app-slider` pill, see below) + the paragraph paginator, over the reading
  column on the paper surface. The reading column is its **own** white rounded sheet
  (`--reader-panel` + `--reader-radius`), a separate container from the options toolbar
  above it — don't fold the two into one card.
- **Word view** (`ui/word-display`): a custom **segmented** control for display (Original /
  Kana / Kanji), a dictionary-language toggle (**EN / 日本語**) and a pitch-accent show/hide
  toggle — the last two are the shared `app-slider` pill. Plus a pitch-accent legend from
  `ACCENT_COLORS`. **No furigana** by decision. The language toggle
  (`DictionaryLanguageEnum`) is passed into each `app-word-box`: the popup shows the English
  translation or the 定義 Japanese definition accordingly, and the legend labels switch
  between romanised (Heiban/Atamadaka/…) and Japanese (平板/頭高/…) names on the same flag.
- **Shared toggle** (`shared/ui/slider.component.ts`, selector `app-slider`): the one pill
  switch style used across the app. Two shapes — two-option (`leftOption`/`rightOption`
  + optional `leftLabel`/`rightLabel`, `onChange` emits the value) or single on/off
  (`label` + `checkedChange`). It's the old Material slider, rewritten as a hand-rolled
  pill (no more `MatSlideToggle` / DOM-poking `setIcon`); also used by the writer story
  editor's Word/Sentence toggle. Reuse it for any binary toggle rather than hand-rolling one.
- **Sentence view** (`ui/sentence-display`): plain reading column; each sentence stays
  **click-to-reveal** (`app-sentence-box` → English popup). An inline bilingual/toggle
  variant was tried and reverted — it got in the way of reading.
