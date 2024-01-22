import { Injectable } from "@angular/core";
import {  ComponentDataSource, EntityListComponentDataService } from "@shared/data/component-data.service";
import { WriterActions } from "@writer/data/writer.actions";
import { WriterQueries } from "@writer/data/writer.queries";
import { WriterState } from "@writer/data/writer.store";
import { CreateStoryDto, StoryDto } from "app/models/Api";

interface WriterComponentData {
}


@Injectable()
export class WriterStoryListDataService extends EntityListComponentDataService<
  StoryDto,
  WriterComponentData,
  WriterState
> {
  constructor(
    private readonly writerActions: WriterActions,
    private readonly writerQueries: WriterQueries,
  ) {
    super(writerQueries);
  }

  protected override onInit(): void {
    this.loadStoryList();
  }

  protected override dataSource(): ComponentDataSource<{}> {
    return {};
  }

  private loadStoryList(): void {
    this.writerActions.loadAllStories();
  }

  create(data: CreateStoryDto) {
    this.writerActions.createStory(data);
  }
}

