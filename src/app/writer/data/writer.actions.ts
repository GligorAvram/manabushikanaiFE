import { Injectable } from "@angular/core";
import { WriterApiService } from "./writer-api.service";
import { WriterStore } from "./writer.store";
import { action } from "@datorama/akita";
import { firstValueFrom } from "rxjs";

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
}