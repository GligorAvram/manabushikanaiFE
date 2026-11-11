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
