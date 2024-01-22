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
  createStory(data: CreateStoryDto): Observable<unknown> {
    throw new Error("Method not implemented.");
    // const formData: FormData = [];
    // return this.postWithFormData(apiRoutes.writer.stories, formData)
  }
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