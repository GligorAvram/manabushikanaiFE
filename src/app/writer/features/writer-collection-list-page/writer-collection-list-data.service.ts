import { Injectable } from '@angular/core';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/component-data.service';
import { WriterActions } from '@writer/data/writer.actions';
import { WriterQueries } from '@writer/data/writer.queries';
import { WriterState } from '@writer/data/writer.store';
import { CollectionDto, CreateCollectionDto, TagDto } from 'app/models/Api';
import { Observable } from 'rxjs';

interface WriterCollectionListComponentData {
    collections: CollectionDto[];
}

@Injectable()
export class WriterCollectionListDataService extends BaseComponentDataService<
    WriterCollectionListComponentData,
    WriterState
> {
    constructor(
        private readonly writerActions: WriterActions,
        private readonly writerQueries: WriterQueries
    ) {
        super( writerQueries );
    }

    protected override onInit(): void {
        this.loadCollectionList();
    }

    protected override dataSource(): ComponentDataSource<WriterCollectionListComponentData> {
        return {
            collections: this.writerQueries.selectCollections()
        };
    }

    private loadCollectionList(): void {
        this.writerActions.loadAllCollections();
    }

    create(data: CreateCollectionDto): void {
        this.writerActions.createCollection( data );
    }

    collectionTags$(collectionId: string): Observable<TagDto[]> {
        return this.writerQueries.selectCollectionTags( collectionId );
    }

    get tagSuggestions$(): Observable<TagDto[]> {
        return this.writerQueries.selectTags();
    }

    searchTagSuggestions(name: string): void {
        this.writerActions.loadAllTags( name );
    }

    addTagToCollection(collectionId: string, name: string): void {
        this.writerActions.addTagToCollection( collectionId, { name } );
    }

    removeTagFromCollection(collectionId: string, tagId: string): void {
        this.writerActions.removeTagFromCollection( collectionId, tagId );
    }
}
