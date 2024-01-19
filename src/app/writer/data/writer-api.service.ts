import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "@shared/data/api.service";
import { CreateStoryDto, StoryDto } from "app/models/Api";
import { Observable } from "rxjs";
import { WriterStore } from "./writer.store";
import { ApiResult } from "@shared/data/api-result";
import { apiRoutes } from "@shared/data/api-routes";

@Injectable({
  providedIn: 'root',
})
export class WriterApiService extends ApiService {
  constructor(private writerStore: WriterStore) {
    super(writerStore);
  }

  getAllStories(): Observable<ApiResult<StoryDto[]>> {
    return this.get(
      apiRoutes.writer.stories,
      this.writerStore.onStoryListLoaded.bind(this.writerStore),
    );
  }
}