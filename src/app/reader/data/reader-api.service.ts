import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageableDto, PaginatedParagraphDto, StoryDto } from '@models/Api';
import { ReaderStore } from '@reader/data/reader.store';
import { ApiResult } from '@shared/data/api-result';
import { apiRoutes } from '@shared/data/api-routes';
import { ApiService } from '@shared/data/api.service';
import { createPaginationParams } from '@shared/functions';
import { Observable } from 'rxjs';

@Injectable( {
                 providedIn: 'root'
             } )
export class ReaderApiService extends ApiService {
    constructor(private readerStore: ReaderStore) {
        super( readerStore );
    }

    getAllStories(): Observable<ApiResult<StoryDto[]>> {
        return this.get(
            apiRoutes.reader.stories.base,
            this.readerStore.onStoryListLoaded.bind( this.readerStore )
        );
    }

    getStoryById(id: string): Observable<ApiResult<StoryDto>> {
        return this.get(
            `${ apiRoutes.reader.stories.base }/${ id }`,
            this.readerStore.onStoryLoaded.bind( this.readerStore )
        );
    }

    getPaginatedParagraphs(storyId: string, page: PageableDto) {
        const paginationParams = createPaginationParams( page );

        return this.getWithParams<HttpParams, PaginatedParagraphDto>(
            `${ apiRoutes.reader.stories.base }/${ storyId }/paragraphs`,
            paginationParams,
            this.readerStore.onParagraphsLoaded.bind( this.readerStore )
        );
    }
}
