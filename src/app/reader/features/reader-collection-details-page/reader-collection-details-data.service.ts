import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ReaderActions } from "@reader/data/reader.actions";
import { ReaderQueries } from "@reader/data/reader.queries";
import { ReaderState } from "@reader/data/reader.store";
import { BaseComponentDataService, ComponentDataSource } from "@shared/data/component-data.service";
import { getParamFromRoute } from "@shared/functions";
import { CollectionDto, StoryDto } from "app/models/Api";
import { map, Observable } from "rxjs";

interface ReaderCollectionDetailsComponentData {
    collection: CollectionDto | null;
    stories: StoryDto[];
}

@Injectable()
export class ReaderCollectionDetailsDataService extends BaseComponentDataService<
    ReaderCollectionDetailsComponentData,
    ReaderState
> {
    constructor(
        private readonly readerQueries: ReaderQueries,
        private readonly readerActions: ReaderActions,
        private readonly _route: ActivatedRoute
    ) {
        super( readerQueries );
    }

    protected override onInit(): void {
        this.readerActions.loadAllCollections();

        const id = this.collectionId;
        if( id ) {
            this.readerActions.loadCollectionStories( id );
        }
    }

    protected override dataSource(): ComponentDataSource<ReaderCollectionDetailsComponentData> {
        return {
            collection: this.selectActiveCollection(),
            stories   : this.readerQueries.selectCollectionStories()
        };
    }

    private selectActiveCollection(): Observable<CollectionDto | null> {
        const id = this.collectionId;

        return this.readerQueries
                   .selectCollections()
                   .pipe( map( (collections) => collections.find( (c) => c.id === id ) ?? null ) );
    }

    private get collectionId(): string | null {
        return getParamFromRoute( 'id', this._route );
    }
}
