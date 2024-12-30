import {Injectable} from '@angular/core';
import {BaseComponentDataService, ComponentDataSource} from '@shared/data/component-data.service';
import {getParamFromRoute} from '@shared/functions';
import {WriterActions} from '@writer/data/writer.actions';
import {WriterQueries} from '@writer/data/writer.queries';
import {
  CreateDictionaryWordDto,
  CreateParagraphTranslationDto, CreateWordTranslationForParagraphDto,
  DictionaryWordDto,
  PaginatedParagraphDto,
  StoryDto
} from 'app/models/Api';
import {ActivatedRoute} from "@angular/router";

interface WriterStoryDetailsComponentData {
  story: StoryDto | null;
  paragraphs: PaginatedParagraphDto | null
  loading: boolean;
  possibleWordTranslations: DictionaryWordDto[];
}

@Injectable()
export class WriterStoryDetailsDataService extends BaseComponentDataService<
  WriterStoryDetailsComponentData
> {
  constructor(
    private readonly writerActions: WriterActions,
    private readonly writerQueries: WriterQueries,
    private readonly _route: ActivatedRoute
  ) {
    super(writerQueries);
  }

  submitTranslationForParagraph(paragraphTranslation: CreateParagraphTranslationDto) {
    this.writerActions.submitTranslationForSentence(paragraphTranslation);
  }

  getTranslationForWord(word: string) {
    this.writerActions.getTranslationForWord(word);
  }

  protected override onInit(): void {
    this.loadStory();
    this.loadParagraphs({pageNumber: 0, pageSize: 10});
  }

  private loadStory() {
    const id = getParamFromRoute('id', this._route);

    if (id) {
      this.writerActions.loadStoryById(id);
    }
  }

  loadParagraphs(page: { pageNumber: number, pageSize: number, sort?: string }) {
    const storyId = getParamFromRoute('id', this._route);

    if (storyId) {
      this.writerActions.loadParagraphs(storyId, page);
    }
  }

  submitWordToDictionary(word: CreateDictionaryWordDto) {
    this.writerActions.submitDictionaryWord(word);
  }

  clearPossibleDictionaryWordList() {
    this.writerActions.clearPossibleDictionaryWordList();
  }

  protected dataSource(): ComponentDataSource<WriterStoryDetailsComponentData> {
    return {
      story: this.writerQueries.selectActiveStory(),
      paragraphs: this.writerQueries.selectParagraphs(),
      loading: this.writerQueries.selectLoading(),
      possibleWordTranslations: this.writerQueries.selectPossibleWordTranslations(),
    };
  }

  submitWordTranslationToParagraph(data: CreateWordTranslationForParagraphDto) {
    this.writerActions.submitWordTranslationForParagraph(data);
  }
}
