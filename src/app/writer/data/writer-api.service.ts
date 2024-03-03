import { Injectable } from "@angular/core";
import { ApiService } from "@shared/data/api.service";
import { SentenceDto, StoryDto } from "app/models/Api";
import { Observable } from "rxjs";
import { WriterStore } from "./writer.store";
import { ApiResult } from "@shared/data/api-result";
import { apiRoutes } from "@shared/data/api-routes";
import { CreateStoryWithFile } from "@writer/ui/story-create-form-modal.component";
import { DifficultyEnum } from "@shared/config/enums/difficulty.enum";

@Injectable({
  providedIn: 'root',
})
export class WriterApiService extends ApiService {
  constructor(private writerStore: WriterStore) {
    super(writerStore);
  }

  getAllStories(): Observable<ApiResult<StoryDto[]>> {
    return this.get(
      apiRoutes.writer.stories.base,
      this.writerStore.onStoryListLoaded.bind(this.writerStore),
    );
  }

  getStoryById(id: string): Observable<ApiResult<StoryDto>> {
    return this.get(
      `${apiRoutes.writer.stories.base}/${id}`,
      this.writerStore.onStoryLoaded.bind(this.writerStore),
    );
  }

  createStory(data: CreateStoryWithFile): Observable<ApiResult<StoryDto>> {
    //todo check data
    const formData = new FormData();
    const storyData = {
      name: data.name!,
      difficulty: DifficultyEnum[data.difficulty!],
    };

    formData.append(
      'storyData',
      new Blob([JSON.stringify(storyData)], { type: 'application/json' }),
    );

    // @ts-ignore
    formData.append('file', data.file[0]!);

    return this.postWithFormData(
      apiRoutes.writer.stories.base,
      formData,
      this.writerStore.onStoryCreated.bind(this.writerStore),
    );
  }

  submitTranslationForSentence(
    sentence: SentenceDto,
  ): Observable<ApiResult<SentenceDto>> {
    return this.patch<{id: string, englishTranslation: string}, SentenceDto>(apiRoutes.writer.stories.translations, {id: sentence.id!, englishTranslation: sentence.englishTranslation!}, this.writerStore.onSentenceTranslationAdded.bind(this.writerStore));
  }
}