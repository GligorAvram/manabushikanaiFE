# Reader module

Reader-side features (browsing published stories, collections, and browsing by tag).
Follows the standard [data-flow pattern](../architecture.md); `ReaderDataModule` provides
the store/queries/actions/api service.

## Docs

- (none yet — add a topic doc when a reader feature grows conventions or gotchas.)

## Conventions specific to reader

- Browse-by-tag lives at `/reader/tags`: a tag input + scope select (`SearchScopeEnum`)
  driving `searchByTag`, with story + collection result tables that have clickable chips.
- The browse page reads a `?tag=` query param and auto-searches, so tag chips elsewhere
  can deep-link into it.
