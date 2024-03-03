import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { BaseEntityState } from '@shared/data/base.state';
import { StoreNameEnum } from '@shared/data/store.constants';
import { storeEvent } from '@shared/data/store.decorators';
import { BaseEntityStore } from '@shared/data/store.models';
import { SentenceDto, StoryDto } from 'app/models/Api';

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
    this.update({ entities: storyList });
  }

  @storeEvent('Story loaded')
  onStoryLoaded(story: StoryDto): void {
    this.update({ active: story });
  }

  @storeEvent('Story created')
  onStoryCreated(story: StoryDto): void {
    this.update({ entities: [story, ...this.getValue().entities] });
  }

  @storeEvent('Sentence translation added')
  onSentenceTranslationAdded(sentence: SentenceDto): void {
    if (
      (this.getValue().active !== null || this.getValue().active !== undefined) &&
      this.getValue().active?.id === sentence.storyID
    ) {
      this.update({
        active: {
          ...this.getValue().active,
          sentences: this.getValue().active!.sentences!
                          .map(oldSentence => oldSentence.id === sentence.id ? sentence : oldSentence).sort((s1, s2)=> s1.order! - s2.order!),
        },
      });
    }
  }
}
