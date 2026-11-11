# Click-to-reveal popups (dictionary / sentence cards)

**Files:** `src/app/reader/ui/word-box.ts`, `src/app/reader/ui/sentence-box.ts`,
`src/app/shared/ui/info-popup-card.component.ts`
**Related:** [reader README](README.md)

Clicking a word or a sentence in the reader opens a styled card. Both share one
presentational component so they look identical.

## Conventions
- **`app-info-popup-card`** (`shared/ui`) owns all the chrome: the **CDK connected
  overlay** (`cdkConnectedOverlay`), card styling, positioning (prefers above the
  trigger, falls back below), and close-on-outside-click/backdrop/detach. It is
  data-driven via inputs — `title`, `titleColor`, `subtitle`, `badges`
  (`InfoPopupBadge[]`), `rows` (`InfoPopupRow[]`), `width` — and emits `closed`.
  Edit visuals here and both popups change together.
- Each box renders its own trigger `<span cdkOverlayOrigin #origin="cdkOverlayOrigin">`,
  holds the `open` flag, and maps its DTO to the card's inputs:
  - `word-box` → `DictionaryWordDto` (dictionary form/kana/pitch accent/English/定義/
    alternative writings/set-phrase/observations). Dictionary form is always coloured
    by accent (`ACCENT_COLORS`), independent of the `showAccent` inline toggle.
  - `sentence-box` → `SentenceDto` (Japanese sentence in the header, English row).
- `PUNCTUATION` / `IGNORE` words are non-clickable (`isClickable` getter) — no popup,
  no hover highlight.
- `InfoPopupRow`s whose `value`/`chips` are empty are skipped by the card, so boxes can
  pass optional fields unconditionally.

## Gotchas
### MatTooltip can't render rich content
- **Symptom:** the original popups could only show one line of plain text
  (`matTooltip="..."`).
- **Cause:** `MatTooltip` renders a plain string only.
- **Rule:** for a styled/multi-field popup use `app-info-popup-card` (CDK overlay),
  not `MatTooltip`.
- **Ref:** `src/app/shared/ui/info-popup-card.component.ts`
