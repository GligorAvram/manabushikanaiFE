# Architecture

**Files:** `src/app/{writer,reader,shared}`, `src/app/shared/data/*`
**Related:** [shared/data-layer](shared/data-layer.md), [shared/state](shared/state.md)

The frontend mirrors the backend's module split: **`writer`**, **`reader`**, and
**`shared`** under `src/app`. Smaller top-level areas (`dashboard`, `profile`,
`settings`, `layouts`) follow the same ideas where relevant.

## Data-flow pattern (every module follows this)

```
HTTP  →  <module>-api.service  →  <module>.store        →  <module>.queries  →  <module>.actions  →  <page>-data.service  →  component
         (extends ApiService)     (BaseStore,                (BaseQuery,           (@action,            (BaseComponentData-
                                   @storeEvent mutators)      select(fn))          firstValueFrom)      Service: data$/source)
```

- **api.service** extends `shared/data/api.service.ts` `ApiService`. Each call takes a
  success callback that writes the result into the store. See
  [shared/data-layer](shared/data-layer.md) for the exact callback/extra-args contract.
- **store** extends `BaseStore` (Elf under the hood). Mutators are decorated with
  `@storeEvent('name')` and do **immutable** `update()` calls. State is persisted to
  `sessionStorage` — see [shared/state](shared/state.md).
- **queries** extend `BaseQuery`; expose `select(state => …)` observables.
- **actions** are `@action`-decorated; call the api service via `firstValueFrom(...)`.
- **data.service** per page extends `BaseComponentDataService`; exposes `data$`
  (a `combineLatest` of the selected sources + `loading`/`success`), `source`, and
  implements `dataSource()` + `onInit()`. The component calls `dataService.init(this)`
  in `ngOnInit`.

**The collections feature (commit `336f85c`) is the canonical template** — copy its
wiring for every layer when adding a feature.

## Modules, DI and lazy loading

- Stores/queries/actions/api services are provided by each module's
  `*-data.module.ts` (e.g. `WriterDataModule`), imported by that module's lazy feature
  modules. API services are also `providedIn: 'root'` but re-provided by the data
  module, so **within one lazy feature scope the api-write store and the query-read
  store are the same instance** (proof: the initial list load appearing in the view).
- Each lazy feature module that imports the data module gets its **own** store instance
  in its lazy injector. Multiple instances share one `persistState` key per store name,
  which is why restored state can be stale/odd-shaped — see
  [shared/state](shared/state.md).
- `src/app/models/Api.ts` is swagger-generated (the backend contract). Don't hand-edit
  its API shape — it's regenerated.

## Gotchas

(Area-specific gotchas live in the topic docs. This file is the map; start here, then
read the `shared/` + module docs for the area you're touching.)
