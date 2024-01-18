import { Injectable } from "@angular/core";
import { StoreConfig } from "@datorama/akita";
import { BaseState } from "@shared/data/base.state";
import { StoreNameEnum } from "@shared/data/store.constants";
import { BaseStore } from "@shared/data/store.models";
import { StoryDto } from "app/models/Api";

export interface WriterState extends BaseState {
    entities: StoryDto[];
    active: StoryDto | null
}

const createInitialState = (): WriterState => ({
  entities: [],
  active: null,
  success: true,
  loading: false
});

@Injectable()
@StoreConfig({ name: StoreNameEnum.Writer })
export class WriterStore extends BaseStore<WriterState> {

    constructor(){
        super(createInitialState());
    }

  set(entities: StoryDto[]): void {
    this.update((state) => ({ ...state, entities }));
  }

  setActive(active: StoryDto | null): void {
    this.update(state => ({...state, active }))
  }

  clearEntities() {
    this.set([]);
  }

  clearActive(){
    this.setActive(null);
  }
}