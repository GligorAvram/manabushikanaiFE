import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { PaginatedParagraphDto, StoryDto } from '@models/Api';
import { BaseState } from '@shared/data/base.state';
import { StoreNameEnum } from '@shared/data/store.constants';
import { storeEvent } from '@shared/data/store.decorators';
import { BaseStore } from '@shared/data/store.models';

export interface ReaderState extends BaseState {
    stories: StoryDto[],
    activeStory: StoryDto | null,
    paragraphs: PaginatedParagraphDto | null
}

const createInitialState = (): ReaderState => (
    {
        stories    : [],
        activeStory: null,
        paragraphs : null,
        success    : false,
        loading    : false
    }
);

@Injectable()
@StoreConfig( { name: StoreNameEnum.Reader } )
export class ReaderStore extends BaseStore<ReaderState> {
    constructor() {
        super( createInitialState() );
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
    onParagraphsLoaded(paragraphs: PaginatedParagraphDto): void {
        this.update( { paragraphs } );
    }
}
