import {Injectable} from '@angular/core';
import {BaseState} from '@shared/data/base.state';
import {StoreNameEnum} from '@shared/data/store.constants';
import {storeEvent} from '@shared/data/store.decorators';
import {CollectionDto, DictionaryWordDto, PaginatedCollectionDto, PaginatedParagraphDto, PaginatedStoryDto, ParagraphDto, PaginatedTagDto, StoryDto, TagDto} from 'app/models/Api';
import {BaseStore} from "@shared/data/store.models";

export interface WriterState extends BaseState {
  stories: StoryDto[],
  paragraphs: PaginatedParagraphDto | null,
  activeStory: StoryDto | null
  possibleWordTranslations: DictionaryWordDto[]
  collections: CollectionDto[]
  activeCollection: CollectionDto | null
  uncategorizedStories: StoryDto[]
  tags: TagDto[]
}

const createInitialState = (): WriterState => ({
  stories: [],
  paragraphs: null,
  possibleWordTranslations: [],
  activeStory: null,
  collections: [],
  activeCollection: null,
  uncategorizedStories: [],
  tags: [],
  success: false,
  loading: false,
  error: null,
});

@Injectable()
export class WriterStore extends BaseStore<WriterState> {
  constructor() {
    super(StoreNameEnum.Writer, createInitialState());
  }

  /** Defensive: persisted/restored state can hold non-array values; always work off a real array. */
  private asArray<T>(value: unknown): T[] {
    return Array.isArray(value) ? value as T[] : [];
  }

  @storeEvent('Story list loaded')
  onStoryListLoaded(page: PaginatedStoryDto): void {
    this.update({stories: page.stories ?? []});
  }

  @storeEvent('Story loaded')
  onStoryLoaded(story: StoryDto): void {
    this.update({activeStory: story});
  }

  @storeEvent('Story created')
  onStoryCreated(story: StoryDto): void {
    this.update({stories: [story, ...this.getValue().stories]});
  }

  @storeEvent('Story list loaded')
  onParagraphsLoaded(paragraphs: PaginatedParagraphDto): void {
    this.update({paragraphs})
  }

  @storeEvent('Sentence translation added')
  onSentenceTranslationAdded(paragraph: ParagraphDto): void {
    this.update({
        paragraphs: {
          ...this.getValue().paragraphs,
          paragraphs: this.getValue().paragraphs?.paragraphs?.map(pp => pp.id === paragraph.id ? paragraph : pp)
        }
      }
    )
  }

  @storeEvent("Dictionary word loaded")
  onDictionaryWordLoaded(dictionaryWord: DictionaryWordDto[]): void {
    this.update({ possibleWordTranslations: dictionaryWord });
  }

  @storeEvent("Reset dictionary word")
  resetDictionaryWordsList(): void {
    this.update({ possibleWordTranslations: [] });
  }

  @storeEvent('Story published')
  onStoryPublished(story: StoryDto): void {
    this.update({activeStory: story});
  }

  @storeEvent('Collection list loaded')
  onCollectionListLoaded(page: PaginatedCollectionDto): void {
    this.update({collections: page.collections ?? []});
  }

  @storeEvent('Collection created')
  onCollectionCreated(collection: CollectionDto): void {
    this.update({collections: [collection, ...this.getValue().collections]});
  }

  @storeEvent('Collection loaded')
  onCollectionLoaded(collection: CollectionDto): void {
    this.update({activeCollection: collection});
  }

  @storeEvent('Uncategorized stories loaded')
  onUncategorizedStoriesLoaded(page: PaginatedStoryDto): void {
    this.update({uncategorizedStories: page.stories ?? []});
  }

  @storeEvent('Tag list loaded')
  onTagListLoaded(page: PaginatedTagDto): void {
    this.update({tags: page.tags ?? []});
  }

  @storeEvent('Tag created')
  onTagCreated(tag: TagDto): void {
    this.update({tags: [tag, ...this.getValue().tags]});
  }

  @storeEvent('Tag updated')
  onTagUpdated(tag: TagDto): void {
    const state = this.getValue();
    this.update({
      tags: this.asArray<TagDto>(state.tags).map(t => t.id === tag.id ? tag : t),
      stories: this.asArray<StoryDto>(state.stories).map(s => ({...s, tags: this.asArray<TagDto>(s.tags).map(t => t.id === tag.id ? tag : t)})),
      collections: this.asArray<CollectionDto>(state.collections).map(c => ({...c, tags: this.asArray<TagDto>(c.tags).map(t => t.id === tag.id ? tag : t)})),
      activeStory: state.activeStory
        ? {...state.activeStory, tags: this.asArray<TagDto>(state.activeStory.tags).map(t => t.id === tag.id ? tag : t)}
        : null,
      activeCollection: state.activeCollection
        ? {...state.activeCollection, tags: this.asArray<TagDto>(state.activeCollection.tags).map(t => t.id === tag.id ? tag : t)}
        : null,
    });
  }

  @storeEvent('Tag deleted')
  onTagDeleted(_deleted: boolean, tagId: string): void {
    const state = this.getValue();
    const withoutTag = (tags?: TagDto[]) => this.asArray<TagDto>(tags).filter(t => t.id !== tagId);
    this.update({
      tags: this.asArray<TagDto>(state.tags).filter(t => t.id !== tagId),
      stories: this.asArray<StoryDto>(state.stories).map(s => ({...s, tags: withoutTag(s.tags)})),
      collections: this.asArray<CollectionDto>(state.collections).map(c => ({...c, tags: withoutTag(c.tags)})),
      activeStory: state.activeStory
        ? {...state.activeStory, tags: withoutTag(state.activeStory.tags)}
        : null,
      activeCollection: state.activeCollection
        ? {...state.activeCollection, tags: withoutTag(state.activeCollection.tags)}
        : null,
    });
  }

  @storeEvent('Story tags changed')
  onStoryTagsChanged(tags: TagDto[], storyId: string): void {
    const state = this.getValue();
    this.update({
      stories: this.asArray<StoryDto>(state.stories).map(s => s.id === storyId ? {...s, tags} : s),
      activeStory: state.activeStory?.id === storyId
        ? {...state.activeStory, tags}
        : state.activeStory,
    });
  }

  @storeEvent('Collection tags changed')
  onCollectionTagsChanged(tags: TagDto[], collectionId: string): void {
    const state = this.getValue();
    this.update({
      collections: this.asArray<CollectionDto>(state.collections).map(c => c.id === collectionId ? {...c, tags} : c),
      activeCollection: state.activeCollection?.id === collectionId
        ? {...state.activeCollection, tags}
        : state.activeCollection,
    });
  }
}
