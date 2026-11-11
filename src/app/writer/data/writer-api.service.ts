import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResult } from '@shared/data/api-result';
import { apiRoutes } from '@shared/data/api-routes';
import { ApiService } from '@shared/data/api.service';
import { createPaginationParams } from '@shared/functions';
import { CreateStoryWithFiles } from '@writer/ui/story-create-form-modal.component';
import { CollectionDto, CreateCollectionDto, CreateDictionaryWordDto, CreateParagraphTranslationDto, CreateStoryDto, CreateWordTranslationForParagraphDto, DictionaryWordDto, PageableDto, PaginatedCollectionDto, PaginatedParagraphDto, PaginatedStoryDto, ParagraphDto, ReorderCollectionDto, StoryDto } from 'app/models/Api';
import { Observable } from 'rxjs';
import { WriterStore } from './writer.store';

@Injectable( {
                 providedIn: 'root'
             } )
export class WriterApiService extends ApiService {
    constructor(private writerStore: WriterStore) {
        super( writerStore );
    }

    getAllStories(): Observable<ApiResult<StoryDto[]>> {
        return this.get(
            apiRoutes.writer.stories.base,
            this.writerStore.onStoryListLoaded.bind( this.writerStore )
        );
    }

    getStoryById(id: string): Observable<ApiResult<StoryDto>> {
        return this.get(
            `${ apiRoutes.writer.stories.base }/${ id }`,
            this.writerStore.onStoryLoaded.bind( this.writerStore )
        );
    }

    createStory(data: CreateStoryWithFiles): Observable<ApiResult<StoryDto>> {
        const formData = new FormData();

        formData.append( 'file', data.file );
        formData.append(
            'storyData',
            new Blob(
                [ JSON.stringify( {
                    name               : data.name,
                    japaneseName       : data.japaneseName,
                    description        : data.description,
                    japaneseDescription: data.japaneseDescription,
                    storyOrigin        : data.storyOrigin,
                    difficulty         : data.difficulty,
                    image              : data.image
                } as CreateStoryDto ) ],
                { type: 'application/json' }
            )
        );

        return this.postWithFormData<StoryDto>(
            apiRoutes.writer.stories.base,
            formData,
            this.writerStore.onStoryCreated.bind( this.writerStore )
        );
    }

    submitTranslationForSentence(
        paragraphTranslation: CreateParagraphTranslationDto
    ): Observable<ApiResult<ParagraphDto>> {
        return this.patch<CreateParagraphTranslationDto, ParagraphDto>(
            apiRoutes.writer.stories.sentences,
            paragraphTranslation,
            this.writerStore.onSentenceTranslationAdded.bind( this.writerStore )
        );
    }

    submitDictionaryWord(word: CreateDictionaryWordDto): Observable<ApiResult<DictionaryWordDto>> {
        return this.post<CreateDictionaryWordDto, DictionaryWordDto>( apiRoutes.writer.stories.dictionary, word );
    }

    getPaginatedParagraphs(storyId: string, page: PageableDto) {
        const paginationParams = createPaginationParams( page );

        return this.getWithParams<HttpParams, PaginatedParagraphDto>(
            `${ apiRoutes.writer.stories.base }/${ storyId }/paragraphs`,
            paginationParams,
            this.writerStore.onParagraphsLoaded.bind( this.writerStore )
        );
    }

    getTranslationForWord(word: string): Observable<ApiResult<DictionaryWordDto[]>> {
        return this.get( `${ apiRoutes.writer.stories.dictionary }/${ word }`, this.writerStore.onDictionaryWordLoaded.bind( this.writerStore ) );
    }

    submitWordTranslationForParagraph(paragraphTranslation: CreateWordTranslationForParagraphDto): Observable<ApiResult<ParagraphDto>> {
        return this.patch<CreateWordTranslationForParagraphDto, ParagraphDto>(
            apiRoutes.writer.stories.words,
            paragraphTranslation,
            this.writerStore.onSentenceTranslationAdded.bind( this.writerStore )
        );
    }

    publishStory(id: string) {
        return this.post<{}, StoryDto>( `${ apiRoutes.writer.stories.base }/${ id }/publish`, {} );
    }

    generateSentenceTranslationWithAI(paragraphId: string): Observable<ApiResult<ParagraphDto>> {
        return this.post<{}, ParagraphDto>(
            `${ apiRoutes.writer.stories.base }/paragraphs/${ paragraphId }/ai/sentences`,
            {},
            this.writerStore.onSentenceTranslationAdded.bind( this.writerStore )
        );
    }

    generateWordTranslationWithAI(paragraphId: string): Observable<ApiResult<ParagraphDto>> {
        return this.post<{}, ParagraphDto>(
            `${ apiRoutes.writer.stories.base }/paragraphs/${ paragraphId }/ai/words`,
            {},
            this.writerStore.onSentenceTranslationAdded.bind( this.writerStore )
        );
    }

    getAllCollections(): Observable<ApiResult<PaginatedCollectionDto>> {
        const paginationParams = createPaginationParams( { pageNumber: 0, pageSize: 100 } );

        return this.getWithParams<HttpParams, PaginatedCollectionDto>(
            apiRoutes.writer.collections.base,
            paginationParams,
            this.writerStore.onCollectionListLoaded.bind( this.writerStore )
        );
    }

    createCollection(data: CreateCollectionDto): Observable<ApiResult<CollectionDto>> {
        return this.post<CreateCollectionDto, CollectionDto>(
            apiRoutes.writer.collections.base,
            data,
            this.writerStore.onCollectionCreated.bind( this.writerStore )
        );
    }

    getStoriesForCollection(collectionId: string): Observable<ApiResult<PaginatedStoryDto>> {
        const paginationParams = createPaginationParams( { pageNumber: 0, pageSize: 100 } );

        return this.getWithParams<HttpParams, PaginatedStoryDto>(
            `${ apiRoutes.writer.collections.base }/${ collectionId }/stories`,
            paginationParams,
            this.writerStore.onCollectionStoriesLoaded.bind( this.writerStore )
        );
    }

    getUncategorizedStories(): Observable<ApiResult<StoryDto[]>> {
        const params = new HttpParams().append( 'uncategorized', true );

        return this.getWithParams<HttpParams, StoryDto[]>(
            apiRoutes.writer.stories.base,
            params,
            this.writerStore.onUncategorizedStoriesLoaded.bind( this.writerStore )
        );
    }

    addStoryToCollection(collectionId: string, storyId: string): Observable<ApiResult<CollectionDto>> {
        return this.post<{}, CollectionDto>(
            `${ apiRoutes.writer.collections.base }/${ collectionId }/stories/${ storyId }`,
            {}
        );
    }

    removeStoryFromCollection(collectionId: string, storyId: string): Observable<ApiResult<CollectionDto>> {
        return this.delete<CollectionDto>(
            `${ apiRoutes.writer.collections.base }/${ collectionId }/stories/${ storyId }`
        );
    }

    reorderCollectionStories(collectionId: string, data: ReorderCollectionDto): Observable<ApiResult<CollectionDto>> {
        return this.put<ReorderCollectionDto, CollectionDto>(
            `${ apiRoutes.writer.collections.base }/${ collectionId }/stories/order`,
            data
        );
    }

}
