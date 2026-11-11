# Writer · Tags

**Files:** `writer/features/writer-tag-list-page/*`, `writer/ui/manage-tags-form-modal.component.ts`,
`writer/ui/tag-form-modal.component.ts`, `writer/data/*` (tag handlers/actions/queries)
**Related:** [shared/data-layer](../shared/data-layer.md), [shared/state](../shared/state.md), [shared/ui-tables](../shared/ui-tables.md)

Tags are many-to-many on stories and collections (KAN-11). Writer side: create / rename /
delete tags, and add/remove tags on an entity (create-or-reuse by name). A per-row
"manage tags" modal on the story/collection lists, plus a dedicated tag admin page at
`/writer/tags`.

## Conventions

- Tag mutations on an entity return the entity's **full new tag list** (`TagDto[]`) and
  pass the entity id as an extra callback arg (`onStoryTagsChanged(tags, storyId)`), per
  the [extra-args contract](../shared/data-layer.md).
- `deleteTag` returns `boolean` and carries no id in the body, so the `tagId` is passed as
  the extra arg to `onTagDeleted(_ok, tagId)`.
- Tag search inputs (the manage-tags modal autocomplete **and** the admin page search box)
  only query after **3+ characters**; clearing the admin search box reloads the full list.

## Gotchas

### Tag store handlers must guard non-array slices
- **Symptom:** rename/delete on the tags page did nothing until refresh; stack showed
  `.map is not a function` in `onTagUpdated`/`onTagDeleted`, swallowed by the api layer.
- **Cause:** the tags page never loads `stories`/`collections`, and those slices came back
  as non-array values from persisted state. The handlers touch them (to keep a story's/
  collection's tag names in sync) and blew up.
- **Rule:** every array access in the tag handlers goes through `asArray(...)`
  (`Array.isArray` guard) — see [shared/state](../shared/state.md). Keep it that way when
  adding handlers that touch cross-slice data.
- **Ref:** `writer.store.ts` `onTagUpdated`, `onTagDeleted`, `onStoryTagsChanged`, `onCollectionTagsChanged`.
