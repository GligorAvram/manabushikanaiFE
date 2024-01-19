import { Injectable } from "@angular/core";
import { StoreConfig } from "@datorama/akita";
import { BaseEntityState } from "@shared/data/base.state";
import { StoreNameEnum } from "@shared/data/store.constants";
import { storeEvent } from "@shared/data/store.decorators";
import { BaseEntityStore } from "@shared/data/store.models";
import { StoryDto } from "app/models/Api";


export interface WriterState extends BaseEntityState<StoryDto> {}

const createInitialState = (): WriterState => ({
  entities: [],
  active: null,
  success: false,
  loading: false,
});

@Injectable()
@StoreConfig({ name: StoreNameEnum.Writer })
export class WriterStore extends BaseEntityStore<StoryDto, WriterState> {
  constructor() {
    super(createInitialState());
  }

  @storeEvent('Story list loaded')
  onStoryListLoaded(storyList: StoryDto[]): void {
    this.update({entities: storyList});
  }
}