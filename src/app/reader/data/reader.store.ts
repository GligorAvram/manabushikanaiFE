import {BaseState} from "@shared/data/base.state";
import {StoryDto} from "@models/Api";
import {Injectable} from "@angular/core";
import {StoreConfig} from "@datorama/akita";
import {StoreNameEnum} from "@shared/data/store.constants";
import {BaseStore} from "@shared/data/store.models";
import {storeEvent} from "@shared/data/store.decorators";

export interface ReaderState extends BaseState {
  stories: StoryDto[],
  activeStory: StoryDto | null,
}

const createInitialState = (): ReaderState => ({
  stories: [],
  activeStory: null,
  success: false,
  loading: false
});

@Injectable()
@StoreConfig({name: StoreNameEnum.Reader})
export class ReaderStore extends BaseStore<ReaderState> {
  constructor() {
    super(createInitialState());
  }

  @storeEvent('Story list loaded')
  onStoryListLoaded(storyList: StoryDto[]): void {
    this.update({stories: storyList});
  }

  @storeEvent('Story loaded')
  onStoryLoaded(story: StoryDto): void {
    this.update({activeStory: story});
  }
}
