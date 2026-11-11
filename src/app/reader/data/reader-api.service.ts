import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollectionDto, PageableDto, PaginatedCollectionDto, PaginatedParagraphDto, PaginatedSearchDto, SearchScopeEnum, StoryDto } from '@models/Api';
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

    getAllCollections(): Observable<ApiResult<PaginatedCollectionDto>> {
        const paginationParams = createPaginationParams( { pageNumber: 0, pageSize: 100 } );

        return this.getWithParams<HttpParams, PaginatedCollectionDto>(
            apiRoutes.reader.collections.base,
            paginationParams,
            this.readerStore.onCollectionListLoaded.bind( this.readerStore )
        );
    }

    getCollection(collectionId: string): Observable<ApiResult<CollectionDto>> {
        return this.get(
            `${ apiRoutes.reader.collections.base }/${ collectionId }`,
            this.readerStore.onCollectionLoaded.bind( this.readerStore )
        );
    }

    searchByTag(
        tag: string,
        scope: SearchScopeEnum = SearchScopeEnum.ALL,
        page: PageableDto = { pageNumber: 0, pageSize: 100 }
    ): Observable<ApiResult<PaginatedSearchDto>> {
        const params = createPaginationParams( page )
            .append( 'tag', tag )
            .append( 'scope', scope );

        return this.getWithParams<HttpParams, PaginatedSearchDto>(
            apiRoutes.reader.search.base,
            params,
            this.readerStore.onSearchResultsLoaded.bind( this.readerStore )
        );
    }
}
