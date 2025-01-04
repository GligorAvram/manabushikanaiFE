import {Injectable} from "@angular/core";
import {BaseQuery} from "@shared/data/base.query";
import {Observable} from "rxjs";
import {StoryDto} from "@models/Api";
import {ReaderState, ReaderStore} from "@reader/data/reader.store";

@Injectable()
export class ReaderQueries extends BaseQuery<ReaderState> {
  constructor(private readonly readerStore: ReaderStore) {
    super(readerStore);
  }

  selectStories(): Observable<StoryDto[]> {
    return this.select((state) => state.stories ?? []);
  }

  selectActiveStory(): Observable<StoryDto | null> {
    return this.select((state) => state.activeStory ?? null);
  }
}
