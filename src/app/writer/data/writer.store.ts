import {Injectable} from '@angular/core';
import {StoreConfig} from '@datorama/akita';
import {BaseState} from '@shared/data/base.state';
import {StoreNameEnum} from '@shared/data/store.constants';
import {storeEvent} from '@shared/data/store.decorators';
import {DictionaryWordDto, PaginatedParagraphDto, ParagraphDto, StoryDto} from 'app/models/Api';
import {BaseStore} from "@shared/data/store.models";

export interface WriterState extends BaseState {
  stories: StoryDto[],
  paragraphs: PaginatedParagraphDto | null,
  activeStory: StoryDto | null
  possibleWordTranslations: DictionaryWordDto[]
}

const createInitialState = (): WriterState => ({
  stories: [],
  paragraphs: null,
  possibleWordTranslations: [],
  activeStory: null,
  success: false,
  loading: false,
});

@Injectable()
@StoreConfig({ name: StoreNameEnum.Writer })
export class WriterStore extends BaseStore<WriterState> {
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

  @storeEvent('Story created')
  onStoryCreated(story: StoryDto): void {
    this.update({stories: [story, ...this.getValue().stories]});
  }

  @storeEvent('Story list loaded')
  onParagraphsLoaded(paragraphs: PaginatedParagraphDto): void {
    this.update({paragraphs})
  }

  @storeEvent('Sentence translation added')
  onSentenceTranslationAdded(paragraph: ParagraphDto): void {
    this.update({
        paragraphs: {
          ...this.getValue().paragraphs,
          paragraphs: this.getValue().paragraphs?.paragraphs?.map(pp => pp.id === paragraph.id ? paragraph : pp)
        }
      }
    )
  }

  @storeEvent("Dictionary word loaded")
  onDictionaryWordLoaded(dictionaryWord: DictionaryWordDto[]): void {
    this.update({ possibleWordTranslations: dictionaryWord });
  }

  @storeEvent("Reset dictionary word")
  resetDictionaryWordsList(): void {
    this.update({ possibleWordTranslations: [] });
  }

  @storeEvent('Story published')
  onStoryPublished(story: StoryDto): void {
    this.update({activeStory: story});
  }
}
