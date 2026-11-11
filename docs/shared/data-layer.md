# Shared · Data layer (ApiService / BaseStore / BaseQuery)

**Files:** `src/app/shared/data/api.service.ts`, `base.query.ts`, `store.models.ts`, `store.decorators.ts`
**Related:** [architecture](../architecture.md), [state](state.md)

## Conventions

- Each module's api service extends `ApiService`. Verbs take a success callback:
  `get/post/put/patch/delete(url, successCb?, ...successCbExtraArgs)`. On success,
  `handleResponse` calls `successCb(result.data, ...successCbExtraArgs)`.
- Use `...successCbExtraArgs` to pass context the response body doesn't carry (e.g. the
  `storyId`/`collectionId`/`tagId` the mutation applies to), so the store handler can
  locate the right entity:
  ```ts
  this.delete<TagDto[]>(url, this.store.onStoryTagsChanged.bind(this.store), storyId);
  // handler: onStoryTagsChanged(tags: TagDto[], storyId: string)
  ```
- Store mutators are `@storeEvent('label')` methods doing immutable `update()`.
- `scheduleReset()` clears `loading/success/error` ~200ms after a write; don't rely on
  those flags staying set.

## Gotchas

### Extra callback args must stay a single array through `handleResponse`
- **Symptom:** a store handler that takes an extra id (e.g. `onTagDeleted(_ok, tagId)`)
  received `["<id>"]` (an array) instead of `"<id>"`, so `id === tagId` never matched
  and the mutation silently did nothing.
- **Cause:** the public verbs collect `...successCbExtraArgs` into an array and pass that
  array **positionally** to `handleResponse`. `handleResponse` must take it as a plain
  array param (`successCbExtraArgs: any[] = []`) and spread it into `successCb`. When it
  was a **rest** param (`...successCbExtraArgs`), the array got double-wrapped to
  `[["<id>"]]`.
- **Rule:** `handleResponse`'s extra-args parameter is a normal array, not rest. Handlers
  that use extra args only work because of this; don't "simplify" it back to a rest param.
- **Ref:** `api.service.ts` `handleResponse`.

### A swagger endpoint turning paginated breaks the hand-written layer silently
- **Symptom:** the stories list threw `NG0900: Only arrays and iterables are allowed`; the
  store's `stories` slice held a `{ totalItems, currentPage, totalPages, stories }` object
  instead of an array.
- **Cause:** `GET /writer/stories` (and `/reader/stories`) changed to return
  `PaginatedStoryDto`. `src/app/models/Api.ts` (ng-openapi-gen) **was** regenerated, but the
  hand-written `*-api.service.ts` + store handler were not — `getAllStories` still typed the
  body as `StoryDto[]` and `onStoryListLoaded` stored the whole paginated object into
  `stories`. The generated model and the hand-written data layer drift independently.
- **Rule:** when an endpoint becomes paginated, update the matching hand-written call to
  `getWithParams(..., createPaginationParams({ pageNumber: 0, pageSize: 100 }))` returning
  the `Paginated*Dto`, and unwrap the inner array in the handler (`page.stories ?? []`) —
  mirror the collections wiring (`onCollectionListLoaded`). After regenerating `Api.ts`,
  grep for `successCb`s typed as a bare `*Dto[]` whose endpoint now returns a `Paginated*Dto`.
- **Ref:** `getAllStories` + `onStoryListLoaded` (writer & reader) and
  `getUncategorizedStories` + `onUncategorizedStoriesLoaded` (writer) — all three hit the now
  paginated `/…/stories` and had to unwrap `page.stories`. Note the same endpoint backs the
  list, the add-to-collection **dropdown** (uncategorized), and search; fixing one call does
  not fix the others. The `BaseQuery.asArray` read guard (see [state](state.md)) is the
  backstop — with it, the dropdown rendered **empty** instead of throwing NG0900, which is a
  quieter and easier-to-miss symptom of the same bug.

### A mutation's returned entity may not carry nested relations — reload instead
- **Symptom:** adding a story to a collection made the whole stories list disappear until a
  page refresh (which then showed all stories including the new one).
- **Cause:** `POST/DELETE/PUT /writer/collections/{id}/stories/...` return a `CollectionDto`
  whose nested `stories` is **not populated** like `GET /collections/{id}` populates it.
  The mutations fed that partial collection straight into `onCollectionLoaded`, overwriting
  `activeCollection.stories` with an empty/absent array (the `asArray` guard then yields `[]`).
- **Rule:** don't trust a mutation response to carry nested lists the view needs. For these
  three, the api methods make the request **without** a store callback and the action reloads
  the entity (`loadCollection(id)`) after it resolves — authoritative and flicker-free (the
  old list stays until the reload lands). Contrast with tag mutations, whose responses *do*
  carry the full new list, so they update the store directly.
- **Ref:** `writer-api.service.ts` `addStoryToCollection`/`removeStoryFromCollection`/
  `reorderCollectionStories`; `writer.actions.ts` same three (`.then(() => this.loadCollection)`).

### Exceptions thrown inside a success callback are swallowed
- **Symptom:** backend returns 200 with the right body, the handler clearly runs, but the
  store never updates and the UI only changes on refresh. An error logs from
  `api.service.ts` with no useful message.
- **Cause:** `handleResponse` pipes `tap(successCb)` **before** `catchError`. Any
  exception thrown inside the store handler is caught by that `catchError` and routed to
  `handleError` — the write is aborted and the error is easy to miss.
- **Rule:** keep store handlers total (never throw) — guard every array/shape assumption
  (see [state](state.md)). `handleError` logs the **full** error object; if a mutation
  "doesn't take", look for a thrown handler, not a backend problem.
- **Ref:** `api.service.ts` `handleResponse` / `handleError`.
