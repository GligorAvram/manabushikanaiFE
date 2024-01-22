import { Injectable } from "@angular/core";
import { WriterApiService } from "./writer-api.service";
import { WriterStore } from "./writer.store";
import { action } from "@datorama/akita";
import { firstValueFrom } from "rxjs";
import { CreateStoryDto } from "app/models/Api";

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

  @action("Create story")
  createStory(data: CreateStoryDto): void {
      firstValueFrom(this.writerApiService.createStory(data)).then();
  }
}