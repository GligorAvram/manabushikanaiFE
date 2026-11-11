import { Injectable } from '@angular/core';
import { CollectionDto, PaginatedCollectionDto, PaginatedParagraphDto, PaginatedStoryDto, StoryDto } from '@models/Api';
import { BaseState } from '@shared/data/base.state';
import { StoreNameEnum } from '@shared/data/store.constants';
import { storeEvent } from '@shared/data/store.decorators';
import { BaseStore } from '@shared/data/store.models';

export interface ReaderState extends BaseState {
    stories: StoryDto[],
    activeStory: StoryDto | null,
    paragraphs: PaginatedParagraphDto | null,
    collections: CollectionDto[],
    collectionStories: StoryDto[]
}

const createInitialState = (): ReaderState => (
    {
        stories          : [],
        activeStory      : null,
        paragraphs       : null,
        collections      : [],
        collectionStories: [],
        success          : false,
        loading          : false,
        error            : null
    }
);

@Injectable()
export class ReaderStore extends BaseStore<ReaderState> {
    constructor() {
        super( StoreNameEnum.Reader, createInitialState() );
    }

    @storeEvent( 'Story list loaded' )
    onStoryListLoaded(stories: StoryDto[]): void {
        this.update( { stories } );
    }

    @storeEvent( 'Story loaded' )
    onStoryLoaded(story: StoryDto): void {
        this.update( { activeStory: story } );
    }

    @storeEvent( 'Paragraphs loaded' )
    onParagraphsLoaded(paragraphPage: PaginatedParagraphDto): void {
        this.update( { paragraphs: { ...paragraphPage, paragraphs: paragraphPage.paragraphs?.sort( (p1, p2) => p1.orderInStory - p2.orderInStory ) } } );
    }

    @storeEvent( 'Collection list loaded' )
    onCollectionListLoaded(page: PaginatedCollectionDto): void {
        this.update( { collections: page.collections ?? [] } );
    }

    @storeEvent( 'Collection stories loaded' )
    onCollectionStoriesLoaded(page: PaginatedStoryDto): void {
        this.update( { collectionStories: page.stories ?? [] } );
    }
}
