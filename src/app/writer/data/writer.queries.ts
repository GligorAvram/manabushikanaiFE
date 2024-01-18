import { Injectable } from "@angular/core";
import { BaseQuery } from "@shared/data/store.models";
import { WriterState, WriterStore } from "./writer.store";
import { Observable } from "rxjs";
import { StoryDto } from "app/models/Api";

@Injectable()
export class WriterQueries extends BaseQuery<WriterState> {
  constructor(private readonly writerStore: WriterStore) {
    super(writerStore);
  }

  selectAllStories(): Observable<StoryDto[]> {
    return this.select((state) => state.entities);
  }

  selectActiveStory(): Observable<StoryDto | null> {
    return this.select((state) => state.active);
  }
}