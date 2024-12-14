import {Injectable} from "@angular/core";
import {BaseComponentDataService, ComponentDataSource} from "@shared/data/component-data.service";
import {WriterActions} from "@writer/data/writer.actions";
import {WriterQueries} from "@writer/data/writer.queries";
import {WriterState} from "@writer/data/writer.store";
import {CreateStoryWithFile} from "@writer/ui/story-create-form-modal.component";
import {StoryDto} from "app/models/Api";

interface WriterComponentData {
  stories: StoryDto[]
}


@Injectable()
export class WriterStoryListDataService extends BaseComponentDataService<
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

  protected override dataSource(): ComponentDataSource<WriterComponentData> {
    return {
      stories: this.writerQueries.selectStories()
    };
  }

  private loadStoryList(): void {
    this.writerActions.loadAllStories();
  }

  create(data: CreateStoryWithFile) {
    this.writerActions.createStory(data);
  }
}

