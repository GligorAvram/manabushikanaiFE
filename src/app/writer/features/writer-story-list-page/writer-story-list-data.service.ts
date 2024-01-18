import { Injectable } from "@angular/core";
import { StoryDto } from "app/models/Api";
import { BaseComponentDataService, ComponentDataSource } from "@shared/data/component-data.service";
import { WriterActions } from "@writer/data/writer.actions";
import { WriterQueries } from "@writer/data/writer.queries";
import { of } from "rxjs";

export interface WriterStoryListPageData {
  stories: StoryDto[];
  isLoading: boolean;
}


export interface WriterData<E extends object> {
  entities: E[];
  active: E;
}

@Injectable()
export class WriterStoryListDataService extends BaseComponentDataService<StoryDto[], WriterStoryListPageData> {
  constructor(
    private readonly writerActions: WriterActions,
    private readonly writerQueries: WriterQueries
  ){
    super(writerQueries);
  }

  override onInit(): void {
    this.loadAllStories();
  }

  protected override dataSource(): ComponentDataSource<StoryDto[]> {
    //todo
    return [of({id: "1", name: "test", difficulty: 5}), of({id: "2", name: "test", difficulty: 1})];
  }

  private loadAllStories(): void {
    this.writerActions.loadAllStories();
  }
}

