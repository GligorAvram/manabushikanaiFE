import { Injectable } from "@angular/core";
import { ReaderActions } from "@reader/data/reader.actions";
import { ReaderQueries } from "@reader/data/reader.queries";
import { ReaderState } from "@reader/data/reader.store";
import { BaseComponentDataService, ComponentDataSource } from "@shared/data/component-data.service";
import { CollectionDto } from "app/models/Api";

interface ReaderCollectionListComponentData {
    collections: CollectionDto[];
}

@Injectable()
export class ReaderCollectionListDataService extends BaseComponentDataService<
    ReaderCollectionListComponentData,
    ReaderState
> {
    constructor(
        private readonly readerQueries: ReaderQueries,
        private readonly readerActions: ReaderActions
    ) {
        super( readerQueries );
    }

    protected override onInit(): void {
        this.readerActions.loadAllCollections();
    }

    protected override dataSource(): ComponentDataSource<ReaderCollectionListComponentData> {
        return {
            collections: this.readerQueries.selectCollections()
        };
    }
}
