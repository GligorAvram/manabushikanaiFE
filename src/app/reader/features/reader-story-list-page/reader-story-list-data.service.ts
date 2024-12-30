import {Injectable} from "@angular/core";
import {BaseComponentDataService, ComponentDataSource} from "@shared/data/component-data.service";
import {StoryDto} from "app/models/Api";
import {ReaderActions} from "@reader/data/reader.actions";
import {ReaderState} from "@reader/data/reader.store";
import {ReaderQueries} from "@reader/data/reader.queries";

interface ReaderComponentData {
  stories: StoryDto[]
}


@Injectable()
export class ReaderStoryListDataService extends BaseComponentDataService<
  ReaderComponentData,
  ReaderState
> {
  constructor(
    private readonly readerQueries: ReaderQueries,
    private readonly readerActions: ReaderActions,
  ) {
    super(readerQueries);
  }

  protected override onInit(): void {
    this.loadStoryList();
  }

  protected override dataSource(): ComponentDataSource<ReaderComponentData> {
    return {
      stories: this.readerQueries.selectStories()
    };
  }

  private loadStoryList(): void {
    this.readerActions.loadAllStories();
  }
}

