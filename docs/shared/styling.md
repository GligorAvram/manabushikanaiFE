# Styling & visual theme
**Files:** `src/styles.css`, `src/index.html`, `src/app/reader/ui/*`
**Related:** [architecture](../architecture.md)

## Conventions

- Global design tokens are CSS custom properties on `:root` in `src/styles.css`
  (`--reader-bg`, `--reader-ink`, `--reader-accent`, `--reader-line`, `--font-ui`,
  `--font-jp`, `--font-reading`, …). Component styles consume them with `var(--token)`
  — CSS vars pierce Angular's emulated encapsulation, so define once, use anywhere.
- Fonts load via `<link>` in `index.html`: Inter (UI), Noto Sans JP (JP UI),
  Shippori Mincho (the reading column), alongside the pre-existing Roboto / Ubuntu.
- The reader is a calm "washi paper" surface (`--reader-bg`) + **one** indigo accent.
  Japanese word colouring is owned by `ACCENT_COLORS` (pitch accent,
  `shared/config/constants/accent-colors.ts`) — don't add other colour systems into the
  reading view; the pitch-accent legend in `word-display` is derived from that constant.
- Reader card lists (`story-list-card`, `collection-list-card`) are responsive CSS grids
  (`repeat(auto-fill, minmax(260px, 1fr))`), not fixed `mat-grid-list cols`. Cards are
  real `<button>`s (keyboard-focusable) rather than click-handlers on a div.
- There is intentionally **no furigana** in the reader (product decision).

## Navigation (chrome)

- `top-bar` + `side-menu` (in the `secure` layout) are the app chrome, restyled to the
  reader palette. The side menu is a full-height flex column: a **scrollable** top with the
  **Reader** and **Writer** browse sections, and a **fixed, always-visible footer** with
  account items (Dashboard / Profile / Settings) + **Log out**.
- The Writer section is behind an `isEditor` flag in `side-menu.component.ts` — currently
  hardcoded `true` (we assume the editor's view) with a TODO to gate on the signed-in
  user's role in the accounts phase. `logout()` is a matching placeholder (no auth yet).
- Active highlighting uses the **`routerLinkActive`** directive, not a hand-rolled
  `router.url.includes(...)` check — see gotcha below.

## Gotchas

### Active nav highlighting must use `routerLinkActive`, not a getter
- **Symptom:** the old side menu's active item was stuck / didn't update on navigation.
- **Cause:** it bound `[class.active]="isEntryActive(entry)"` which read `router.url` in a
  getter, on an `OnPush` component. Navigation doesn't mark the menu dirty, so the binding
  was never re-evaluated. (`url.includes()` is also prefix-fragile.)
- **Rule:** use `routerLinkActive="..."` on the `<a [routerLink]>` — the directive tracks
  the active route reactively and marks the view for check.
- **Ref:** `src/app/shared/ui/side-menu.component.ts`

### Bootstrap utility classes are no-ops
- **Symptom:** templates use `d-flex`, `w-100`, `rounded-3`, `p-3`, `shadow`, `mb-3`,
  `mx-2`, etc., but they have no visual effect.
- **Cause:** Bootstrap is **not** a dependency and no Bootstrap CSS is loaded
  (`styles.css` only imports the Material prebuilt theme). These classes were carried
  over from somewhere but never resolve.
- **Rule:** don't rely on Bootstrap utilities for layout. Write real CSS in the
  component's `styles` (flex/grid + the design tokens). Treat existing utility classes
  as inert until/unless Bootstrap is actually added.
- **Bitten by this:** `header.component` + `title.component` relied on `d-flex` /
  `justify-content-*` so their sections stacked vertically (header action fell below the
  title; title icon stacked above its text). Both were rewritten with real flex — title
  icon now sits inline and uses `--reader-accent`; header actions go top-right via the
  `[headerRight]` slot.
- **Ref:** `src/styles.css`, `package.json` (no bootstrap dependency),
  `src/app/shared/ui/header.component.ts`, `src/app/shared/ui/title.component.ts`.
