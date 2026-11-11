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
