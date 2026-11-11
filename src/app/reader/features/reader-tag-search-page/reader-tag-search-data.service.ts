import { Injectable } from '@angular/core';
import { ReaderActions } from '@reader/data/reader.actions';
import { ReaderQueries } from '@reader/data/reader.queries';
import { ReaderState } from '@reader/data/reader.store';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/component-data.service';
import { CollectionDto, SearchScopeEnum, StoryDto } from 'app/models/Api';

interface ReaderTagSearchComponentData {
    stories: StoryDto[];
    collections: CollectionDto[];
}

@Injectable()
export class ReaderTagSearchDataService extends BaseComponentDataService<
    ReaderTagSearchComponentData,
    ReaderState
> {
    constructor(
        private readonly readerActions: ReaderActions,
        private readonly readerQueries: ReaderQueries
    ) {
        super( readerQueries );
    }

    protected override onInit(): void {
        // Results are loaded on demand from the search input / query param.
    }

    protected override dataSource(): ComponentDataSource<ReaderTagSearchComponentData> {
        return {
            stories    : this.readerQueries.selectSearchStories(),
            collections: this.readerQueries.selectSearchCollections()
        };
    }

    search(tag: string, scope: SearchScopeEnum): void {
        this.readerActions.searchByTag( tag, scope );
    }
}
