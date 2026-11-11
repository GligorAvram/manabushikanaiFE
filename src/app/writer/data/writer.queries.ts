import {Injectable} from "@angular/core";
import {WriterState, WriterStore} from "./writer.store";
import {Observable} from "rxjs";
import {CollectionDto, StoryDto} from "app/models/Api";
import {BaseQuery} from "@shared/data/base.query";

@Injectable()
export class WriterQueries extends BaseQuery<WriterState> {
  constructor(private readonly writerStore: WriterStore) {
    super(writerStore);
  }

  selectStories(): Observable<StoryDto[]> {
    return this.select((state) => state.stories ?? []);
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
    return this.select((state) => state.collections ?? []);
  }

  selectActiveCollection(): Observable<CollectionDto | null> {
    return this.select((state) => state.activeCollection ?? null);
  }

  selectCollectionStories(): Observable<StoryDto[]> {
    return this.select((state) => state.activeCollection?.stories ?? []);
  }

  selectUncategorizedStories(): Observable<StoryDto[]> {
    return this.select((state) => state.uncategorizedStories ?? []);
  }
}
