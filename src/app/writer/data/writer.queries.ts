import {Injectable} from "@angular/core";
import {WriterState, WriterStore} from "./writer.store";
import {Observable} from "rxjs";
import {CollectionDto, StoryDto, TagDto} from "app/models/Api";
import {BaseQuery} from "@shared/data/base.query";

@Injectable()
export class WriterQueries extends BaseQuery<WriterState> {
  constructor(private readonly writerStore: WriterStore) {
    super(writerStore);
  }

  selectStories(): Observable<StoryDto[]> {
    return this.select((state) => this.asArray<StoryDto>(state.stories));
  }

  selectActiveStory(): Observable<StoryDto | null> {
    return this.select((state) => state.activeStory ?? null);
  }

  selectParagraphs() {
    return this.select((state => state.paragraphs));
  }

  selectPossibleWordTranslations() {
    return this.select((state => state.possibleWordTranslations));
  }

  selectCollections(): Observable<CollectionDto[]> {
    return this.select((state) => this.asArray<CollectionDto>(state.collections));
  }

  selectActiveCollection(): Observable<CollectionDto | null> {
    return this.select((state) => state.activeCollection ?? null);
  }

  selectCollectionStories(): Observable<StoryDto[]> {
    return this.select((state) => this.asArray<StoryDto>(state.activeCollection?.stories));
  }

  selectUncategorizedStories(): Observable<StoryDto[]> {
    return this.select((state) => this.asArray<StoryDto>(state.uncategorizedStories));
  }

  selectTags(): Observable<TagDto[]> {
    return this.select((state) => this.asArray<TagDto>(state.tags));
  }

  selectStoryTags(storyId: string): Observable<TagDto[]> {
    return this.select((state) => this.asArray<TagDto>(this.asArray<StoryDto>(state.stories).find((story) => story.id === storyId)?.tags));
  }

  selectCollectionTags(collectionId: string): Observable<TagDto[]> {
    return this.select((state) => this.asArray<TagDto>(this.asArray<CollectionDto>(state.collections).find((collection) => collection.id === collectionId)?.tags));
  }
}
