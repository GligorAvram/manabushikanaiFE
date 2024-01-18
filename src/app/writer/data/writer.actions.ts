import { Injectable } from "@angular/core";
import { action } from "@datorama/akita";
import { WriterApiService } from "@writer/data/writer-api.service";
import { firstValueFrom } from "rxjs";
import { WriterStore } from "./writer.store";


@Injectable()
export class WriterActions {
  constructor(
    private readonly writerApiService: WriterApiService,
    private readonly writerStore: WriterStore,
  ) {}

  @action('Load all stories')
  loadAllStories(): void {
    this.writerStore.clearEntities();
    firstValueFrom(this.writerApiService.getAllStories()).then();
  }

  @action('Load story by id')
  loadStoriesById(id: string): void {
    this.writerStore.clearActive();
    firstValueFrom(this.writerApiService.getStoryById(id)).then();
  }
}
