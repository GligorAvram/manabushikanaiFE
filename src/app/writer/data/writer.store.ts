import { Injectable } from '@angular/core';
import { StoreConfig } from '@datorama/akita';
import { BaseEntityState } from '@shared/data/base.state';
import { StoreNameEnum } from '@shared/data/store.constants';
import { storeEvent } from '@shared/data/store.decorators';
import { BaseEntityStore } from '@shared/data/store.models';
import { ParagraphDto, SentenceDto, StoryDto } from 'app/models/Api';

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

  @storeEvent('Paragraph translation added')
  onSentenceTranslationAdded(paragraph: ParagraphDto): void {
    if (
      (this.getValue().active !== null || this.getValue().active !== undefined) &&
      this.getValue().active?.id === paragraph.storyId
    ) {
      this.update({
        active: {
          ...this.getValue().active,
          paragraphs: this.getValue()
            .active!.paragraphs!.map((oldParagraph) =>
              oldParagraph.id === paragraph.id ? paragraph : oldParagraph,
            )
            .sort((p1, p2) => p1.orderInStory! - p2.orderInStory!),
        },
      });
    }
  }
}
