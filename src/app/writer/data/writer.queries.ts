import {Injectable} from "@angular/core";
import {WriterState, WriterStore} from "./writer.store";
import {Observable} from "rxjs";
import {StoryDto} from "app/models/Api";
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
}
