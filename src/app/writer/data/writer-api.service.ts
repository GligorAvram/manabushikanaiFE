import {Injectable} from "@angular/core";
import {ApiService} from "@shared/data/api.service";
import {
  CreateDictionaryWordDto,
  CreateParagraphTranslationDto,
  CreateWordTranslationForParagraphDto,
  DictionaryWordDto,
  PaginatedParagraphDto,
  ParagraphDto,
  StoryDto
} from "app/models/Api";
import {Observable} from "rxjs";
import {WriterStore} from "./writer.store";
import {ApiResult} from "@shared/data/api-result";
import {apiRoutes} from "@shared/data/api-routes";
import {CreateStoryWithFile} from "@writer/ui/story-create-form-modal.component";
import {HttpParams} from "@angular/common/http";

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
      name: data.name,
      description: data.description,
      difficulty: data.difficulty,
    };

    formData.append(
      'storyData',
      new Blob([JSON.stringify(storyData)], { type: 'application/json' }),
    );

    // @ts-ignore
    formData.append('file', data.file);
    formData.append("image", data.image);

    return this.postWithFormData(
      apiRoutes.writer.stories.base,
      formData,
      this.writerStore.onStoryCreated.bind(this.writerStore),
    );
  }

  submitTranslationForSentence(
    paragraphTranslation: CreateParagraphTranslationDto,
  ): Observable<ApiResult<ParagraphDto>> {
    return this.patch<CreateParagraphTranslationDto, ParagraphDto>(
      apiRoutes.writer.stories.sentences,
      paragraphTranslation,
      this.writerStore.onSentenceTranslationAdded.bind(this.writerStore),
    );
  }

  submitDictionaryWord(word: CreateDictionaryWordDto): Observable<ApiResult<DictionaryWordDto>> {
    return this.post<CreateDictionaryWordDto, DictionaryWordDto>(apiRoutes.writer.stories.dictionary, word)
  }

  getPaginatedParagraphs(storyId: string, page: { pageNumber: number; pageSize: number; sort?: string }) {
    // TODO refactor to a function
    let paginationParams: HttpParams = new HttpParams();
    const pp = paginationParams.appendAll(page);

    return this.getWithParams<HttpParams, PaginatedParagraphDto>(
      `${apiRoutes.writer.stories.base}/${storyId}/paragraphs`,
      pp,
      this.writerStore.onParagraphsLoaded.bind(this.writerStore)
    );
  }

  getTranslationForWord(word: string): Observable<ApiResult<DictionaryWordDto[]>> {
    return this.get(`${apiRoutes.writer.stories.dictionary}/${word}`, this.writerStore.onDictionaryWordLoaded.bind(this.writerStore));
  }

  submitWordTranslationForParagraph(paragraphTranslation: CreateWordTranslationForParagraphDto): Observable<ApiResult<ParagraphDto>> {
    return this.patch<CreateWordTranslationForParagraphDto, ParagraphDto>(
      apiRoutes.writer.stories.words,
      paragraphTranslation,
      this.writerStore.onSentenceTranslationAdded.bind(this.writerStore)
    )
  }

  publishStory(id: string) {
    return this.post<{}, StoryDto>(`${apiRoutes.writer.stories.base}/${id}/publish`, {})
  }
}
