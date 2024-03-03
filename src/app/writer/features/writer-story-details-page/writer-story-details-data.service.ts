import { Injectable } from '@angular/core';
import {
  ComponentDataSource,
  EntityDetailsComponentDataService,
  } from '@shared/data/component-data.service';
import { getParamFromRoute } from '@shared/functions';
import { WriterActions } from '@writer/data/writer.actions';
import { WriterQueries } from '@writer/data/writer.queries';
import { SentenceDto, StoryDto } from 'app/models/Api';

interface WriterStoryDetailsComponentData {
  story: StoryDto | null;
  loading: boolean;
}

@Injectable()
export class WriterStoryDetailsDataService extends EntityDetailsComponentDataService<
  StoryDto,
  WriterStoryDetailsComponentData
> {
  constructor(
    private readonly writerActions: WriterActions,
    private readonly writerQueries: WriterQueries,
  ) {
    super(writerQueries);
  }

  submitTranslationForSentence(sentence: SentenceDto) {
    this.writerActions.submitTranslationForSentence(sentence);
  }

  protected dataSource(): ComponentDataSource<WriterStoryDetailsComponentData> {
    return {
      story: this.writerQueries.selectActive(),
      loading: this.writerQueries.selectLoading(),
    };
  }

  protected override onInit(): void {
    this.loadStory();
  }

  private loadStory() {
    const id = getParamFromRoute('id', this._route);

    if (id) {
      this.writerActions.loadStoryById(id);
    }
  }
}
