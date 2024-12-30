import {Injectable} from "@angular/core";
import {action} from "@datorama/akita";
import {firstValueFrom} from "rxjs";
import {ReaderStore} from "@reader/data/reader.store";
import {ReaderApiService} from "@reader/data/reader-api.service";

@Injectable()
export class ReaderActions {
  constructor(
    private readonly readerApiService: ReaderApiService,
    private readonly readerStore: ReaderStore,
  ) {
  }

  @action('Load all stories')
  loadAllStories(): void {
    firstValueFrom(this.readerApiService.getAllStories()).then();
  }
}
