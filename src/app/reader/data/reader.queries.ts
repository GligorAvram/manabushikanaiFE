import { Injectable } from '@angular/core';
import { CollectionDto, PaginatedParagraphDto, SearchResultDto, SearchResultTypeEnum, StoryDto } from '@models/Api';
import { ReaderState, ReaderStore } from '@reader/data/reader.store';
import { BaseQuery } from '@shared/data/base.query';
import { Observable } from 'rxjs';

@Injectable()
export class ReaderQueries extends BaseQuery<ReaderState> {
    constructor(private readonly readerStore: ReaderStore) {
        super( readerStore );
    }

    selectStories(): Observable<StoryDto[]> {
        return this.select( (state) => state.stories ?? [] );
    }

    selectActiveStory(): Observable<StoryDto | null> {
        return this.select( (state) => state.activeStory ?? null );
    }

    selectParagraphs(): Observable<PaginatedParagraphDto | null> {
        return this.select( state => state.paragraphs ?? null );
    }

    selectCollections(): Observable<CollectionDto[]> {
        return this.select( (state) => state.collections ?? [] );
    }

    selectActiveCollection(): Observable<CollectionDto | null> {
        return this.select( (state) => state.activeCollection ?? null );
    }

    selectCollectionStories(): Observable<StoryDto[]> {
        return this.select( (state) => state.activeCollection?.stories ?? [] );
    }

    selectSearchResults(): Observable<SearchResultDto[]> {
        return this.select( (state) => state.searchResults ?? [] );
    }

    selectSearchStories(): Observable<StoryDto[]> {
        return this.select( (state) =>
            (state.searchResults ?? [])
                .filter( (result) => result.type === SearchResultTypeEnum.STORY && !!result.story )
                .map( (result) => result.story! )
        );
    }

    selectSearchCollections(): Observable<CollectionDto[]> {
        return this.select( (state) =>
            (state.searchResults ?? [])
                .filter( (result) => result.type === SearchResultTypeEnum.COLLECTION && !!result.collection )
                .map( (result) => result.collection! )
        );
    }
}
