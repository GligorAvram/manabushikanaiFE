import {Injectable} from "@angular/core";
import {ApiService} from "@shared/data/api.service";
import {Observable} from "rxjs";
import {ApiResult} from "@shared/data/api-result";
import {StoryDto} from "@models/Api";
import {apiRoutes} from "@shared/data/api-routes";
import {ReaderStore} from "@reader/data/reader.store";

@Injectable({
  providedIn: 'root',
})
export class ReaderApiService extends ApiService {
  constructor(private readerStore: ReaderStore) {
    super(readerStore);
  }

  getAllStories(): Observable<ApiResult<StoryDto[]>> {
    return this.get(
      apiRoutes.reader.stories.base,
      this.readerStore.onStoryListLoaded.bind(this.readerStore),
    );
  }

  getStoryById(id: string): Observable<ApiResult<StoryDto>> {
    return this.get(
      `${apiRoutes.reader.stories.base}/${id}`,
      this.readerStore.onStoryLoaded.bind(this.readerStore),
    );
  }
}
