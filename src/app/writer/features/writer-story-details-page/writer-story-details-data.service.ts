import { Injectable } from '@angular/core';
import {
  BaseComponentDataService,
  ComponentDataSource,
  EntityListComponentDataService,
} from '@shared/data/component-data.service';
import { WriterActions } from '@writer/data/writer.actions';
import { WriterQueries } from '@writer/data/writer.queries';
import { WriterState } from '@writer/data/writer.store';
import { StoryDto } from 'app/models/Api';

interface WriterStoryDetailsComponentData {}

@Injectable()
export class WriterStoryDetailsDataService extends EntityListComponentDataService<
  StoryDto,
  WriterStoryDetailsComponentData,
  WriterState
> {
  constructor(
    private readonly writerActions: WriterActions,
    private readonly writerQueries: WriterQueries,
  ) {
    super(writerQueries);
  }

  protected dataSource(): ComponentDataSource<WriterStoryDetailsComponentData> {
    return {
      //   story: this.writerQueries.selectStoryById(),
      //   storyLoading: this.writerQueries.selectLoading(),
    };
  }

  protected onInit(): void {
    this.loadStory();
  }

  loadStory() {
        throw new Error('Method not implemented.');
  }
}
