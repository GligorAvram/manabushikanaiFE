import { Injectable } from '@angular/core';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/component-data.service';
import { WriterActions } from '@writer/data/writer.actions';
import { WriterQueries } from '@writer/data/writer.queries';
import { WriterState } from '@writer/data/writer.store';
import { CreateStoryWithFiles } from '@writer/ui/story-create-form-modal.component';
import { StoryDto, TagDto } from 'app/models/Api';
import { Observable } from 'rxjs';

interface WriterComponentData {
    stories: StoryDto[];
}

@Injectable()
export class WriterStoryListDataService extends BaseComponentDataService<
    WriterComponentData,
    WriterState
> {
    constructor(
        private readonly writerActions: WriterActions,
        private readonly writerQueries: WriterQueries
    ) {
        super( writerQueries );
    }

    protected override onInit(): void {
        this.loadStoryList();
    }

    protected override dataSource(): ComponentDataSource<WriterComponentData> {
        return {
            stories: this.writerQueries.selectStories()
        };
    }

    private loadStoryList(): void {
        this.writerActions.loadAllStories();
    }

    create(data: CreateStoryWithFiles) {
        this.writerActions.createStory( data );
    }

    storyTags$(storyId: string): Observable<TagDto[]> {
        return this.writerQueries.selectStoryTags( storyId );
    }

    get tagSuggestions$(): Observable<TagDto[]> {
        return this.writerQueries.selectTags();
    }

    searchTagSuggestions(name: string): void {
        this.writerActions.loadAllTags( name );
    }

    addTagToStory(storyId: string, name: string): void {
        this.writerActions.addTagToStory( storyId, { name } );
    }

    removeTagFromStory(storyId: string, tagId: string): void {
        this.writerActions.removeTagFromStory( storyId, tagId );
    }
}

