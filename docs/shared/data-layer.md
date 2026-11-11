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
