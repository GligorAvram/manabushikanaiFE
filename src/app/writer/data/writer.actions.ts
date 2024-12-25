import {Injectable} from "@angular/core";
import {WriterApiService} from "./writer-api.service";
import {WriterStore} from "./writer.store";
import {action} from "@datorama/akita";
import {firstValueFrom} from "rxjs";
import {CreateStoryWithFile} from "@writer/ui/story-create-form-modal.component";
import {
  CreateDictionaryWordDto,
  CreateParagraphTranslationDto,
  CreateWordTranslationForParagraphDto
} from "app/models/Api";

@Injectable()
export class WriterActions {
  constructor(
    private readonly writerApiService: WriterApiService,
    private readonly writerStore: WriterStore,
  ) {}

  @action('Load all stories')
  loadAllStories(): void {
    firstValueFrom(this.writerApiService.getAllStories()).then();
  }

  @action('Load story by id')
  loadStoryById(id: string): void {
    firstValueFrom(this.writerApiService.getStoryById(id)).then();
  }

  @action('Create story')
  createStory(data: CreateStoryWithFile): void {
    firstValueFrom(this.writerApiService.createStory(data)).then();
  }

  @action('Add translation to paragraph')
  submitTranslationForSentence(paragraphTranslation: CreateParagraphTranslationDto) {
    firstValueFrom(
      this.writerApiService.submitTranslationForSentence(paragraphTranslation),
    ).then();
  }

  @action('Add word to dictionary')
  submitDictionaryWord(word: CreateDictionaryWordDto) {
    firstValueFrom(this.writerApiService.submitDictionaryWord(word)).then();
  }

  @action("Load paragraphs for story")
  loadParagraphs(storyId: string, page: { pageNumber: number; pageSize: number; sort?: string }) {
    firstValueFrom(this.writerApiService.getPaginatedParagraphs(storyId, page)).then()
  }

  @action("Get translation for word")
  getTranslationForWord(word: string) {
    firstValueFrom(this.writerApiService.getTranslationForWord(word)).then();
  }

  @action("Add word translation to paragraph")
  submitWordTranslationForParagraph(data: CreateWordTranslationForParagraphDto) {
    firstValueFrom(this.writerApiService.submitWordTranslationForParagraph(data)).then();
  }

  clearPossibleDictionaryWordList() {
    this.writerStore.resetDictionaryWordsList();
  }

}
