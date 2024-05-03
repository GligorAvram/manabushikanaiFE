import { Injectable } from "@angular/core";
import { ApiService } from "@shared/data/api.service";
import { CreateDictionaryWordDto, CreateParagraphTranslationDto, CreateSentenceDto, CreateWordTranslationForParagraphDto, DictionaryWordDto, PageableDto, ParagraphDto, StoryDto } from "app/models/Api";
import { Observable } from "rxjs";
import { WriterStore } from "./writer.store";
import { ApiResult } from "@shared/data/api-result";
import { apiRoutes } from "@shared/data/api-routes";
import { CreateStoryWithFile } from "@writer/ui/story-create-form-modal.component";
import { DifficultyEnum } from "@shared/config/enums/difficulty.enum";

@Injectable({
    providedIn: "root",
})
export class WriterApiService extends ApiService {
    constructor(private writerStore: WriterStore) {
        super(writerStore);
    }
    //todo the undefined
    getAllStories(dto?: PageableDto | undefined): Observable<ApiResult<StoryDto[]>> {
        const pageSize = dto?.pageSize ? `/pageSize=${dto!.pageSize}` : "";
        const pageNumber = dto?.pageNumber ? `/pageNumber=${dto!.pageNumber}` : "";
        const sort = dto?.sort ? `/sort=${dto!.sort}` : "";
        return this.get(
            //todo use the get with params method
            `${apiRoutes.writer.stories.base}${pageNumber}${pageSize}${sort}`,
            this.writerStore.onStoryListLoaded.bind(this.writerStore),
        );
    }

    getStoryById(id: string): Observable<ApiResult<StoryDto>> {
        return this.get(`${apiRoutes.writer.stories.base}/${id}`, this.writerStore.onStoryLoaded.bind(this.writerStore));
    }

    createStory(data: CreateStoryWithFile): Observable<ApiResult<StoryDto>> {
        //todo check data
        const formData = new FormData();
        const storyData = {
            name: data.name!,
            difficulty: DifficultyEnum[data.difficulty!],
        };

        formData.append("storyData", new Blob([JSON.stringify(storyData)], { type: "application/json" }));

        // @ts-ignore
        formData.append("file", data.file[0]!);

        return this.postWithFormData(apiRoutes.writer.stories.base, formData, this.writerStore.onStoryCreated.bind(this.writerStore));
    }

    submitSentenceTranslationForParagraph(sentenceTranslation: CreateParagraphTranslationDto): Observable<ApiResult<ParagraphDto>> {
        return this.patch<CreateParagraphTranslationDto, ParagraphDto>(apiRoutes.writer.stories.translationsSentences, sentenceTranslation, this.writerStore.onSentenceTranslationAdded.bind(this.writerStore));
    }

    submitWordTranslationForParagraph(wordTranslation: CreateWordTranslationForParagraphDto): Observable<ApiResult<ParagraphDto>> {
        return this.patch<CreateWordTranslationForParagraphDto, ParagraphDto>(apiRoutes.writer.stories.translationsWords, wordTranslation, this.writerStore.onWordTranslationAdded.bind(this.writerStore));
    }

    submitDictionaryWord(word: CreateDictionaryWordDto): Observable<ApiResult<DictionaryWordDto>> {
        return this.post<CreateDictionaryWordDto, DictionaryWordDto>(apiRoutes.writer.stories.dictionary, word);
    }

    getTranslationForWord(word: string): Observable<ApiResult<DictionaryWordDto[]>> {
        return this.get(`${apiRoutes.writer.stories.dictionary}/${word}`, this.writerStore.onDictionaryWordLoaded.bind(this.writerStore));
    }
}
