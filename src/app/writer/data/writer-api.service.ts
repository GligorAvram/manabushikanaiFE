import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResult } from '@shared/data/api-result';
import { apiRoutes } from '@shared/data/api-routes';
import { ApiService } from '@shared/data/api.service';
import { createPaginationParams } from '@shared/functions';
import { CreateStoryWithFiles } from '@writer/ui/story-create-form-modal.component';
import { CreateDictionaryWordDto, CreateParagraphTranslationDto, CreateStoryDto, CreateWordTranslationForParagraphDto, DictionaryWordDto, FileDto, FileTypeEnum, PageableDto, PaginatedParagraphDto, ParagraphDto, StoryDto } from 'app/models/Api';
import { forkJoin, Observable, switchMap } from 'rxjs';
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
        return forkJoin( {
                             thumbnail: this.uploadFile( data.image, FileTypeEnum.THUMBNAIL ),
                             file     : this.uploadFile( data.file, FileTypeEnum.STORY )
                         } )
            .pipe(
                switchMap( ({ thumbnail, file }) => {
                    return this.post<CreateStoryDto, StoryDto>(
                        apiRoutes.writer.stories.base,
                        {
                            name               : data.name,
                            japaneseName       : data.japaneseName,
                            description        : data.description,
                            japaneseDescription: data.japaneseDescription,
                            difficulty         : data.difficulty,
                            thumbnailId        : thumbnail.data?.id,
                            fileId             : file.data!.id!
                        },
                        this.writerStore.onStoryCreated.bind( this.writerStore ) );
                } )
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

    uploadFile(file: File, type: FileTypeEnum): Observable<ApiResult<FileDto>> {
        const formData = new FormData();

        formData.append( 'file', file );

        formData.append(
            'dto',
            new Blob( [ JSON.stringify( { 'fileType': type } ) ], { type: 'application/json' } )
        );

        return this.postWithFormData<FileDto>(
            apiRoutes.writer.files.base,
            formData
        );
    }
}
