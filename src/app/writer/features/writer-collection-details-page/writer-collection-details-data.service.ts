import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/component-data.service';
import { getParamFromRoute } from '@shared/functions';
import { WriterActions } from '@writer/data/writer.actions';
import { WriterQueries } from '@writer/data/writer.queries';
import { CollectionDto, StoryDto } from 'app/models/Api';

interface WriterCollectionDetailsComponentData {
    collection: CollectionDto | null;
    stories: StoryDto[];
    uncategorizedStories: StoryDto[];
}

@Injectable()
export class WriterCollectionDetailsDataService extends BaseComponentDataService<
    WriterCollectionDetailsComponentData
> {
    constructor(
        private readonly writerActions: WriterActions,
        private readonly writerQueries: WriterQueries,
        private readonly _route: ActivatedRoute
    ) {
        super( writerQueries );
    }

    protected override onInit(): void {
        const id = this.collectionId;
        if( id ) {
            this.writerActions.loadCollection( id );
        }
    }

    protected override dataSource(): ComponentDataSource<WriterCollectionDetailsComponentData> {
        return {
            collection          : this.writerQueries.selectActiveCollection(),
            stories             : this.writerQueries.selectCollectionStories(),
            uncategorizedStories: this.writerQueries.selectUncategorizedStories()
        };
    }

    searchUncategorizedStories(name: string): void {
        this.writerActions.loadUncategorizedStories( name );
    }

    addStory(storyId: string): void {
        const id = this.collectionId;
        if( id ) {
            this.writerActions.addStoryToCollection( id, storyId );
        }
    }

    removeStory(storyId: string): void {
        const id = this.collectionId;
        if( id ) {
            this.writerActions.removeStoryFromCollection( id, storyId );
        }
    }

    reorderStories(storyIds: string[]): void {
        const id = this.collectionId;
        if( id ) {
            this.writerActions.reorderCollectionStories( id, { storyIds } );
        }
    }

    private get collectionId(): string | null {
        return getParamFromRoute( 'id', this._route );
    }
}
