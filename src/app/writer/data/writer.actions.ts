import { Injectable } from "@angular/core";
import { WriterApiService } from "./writer-api.service";
import { WriterStore } from "./writer.store";
import { action } from "@datorama/akita";
import { firstValueFrom } from "rxjs";
import { CreateStoryWithFile } from "@writer/ui/story-create-form-modal.component";
import { CreateDictionaryWordDto, CreateParagraphTranslationDto, CreateWordTranslationForParagraphDto, PageableDto } from 'app/models/Api';

@Injectable()
export class WriterActions {
    constructor(
        private readonly writerApiService: WriterApiService,
        private readonly writerStore: WriterStore,
    ) {}

    @action("Load all stories")
    loadAllStories(): void {
        this.writerStore.clearEntities();
        //todo
        firstValueFrom(this.writerApiService.getAllStories()).then();
    }

    @action("Load story by id")
    loadStoryById(id: string): void {
        this.writerStore.clearActive();
        firstValueFrom(this.writerApiService.getStoryById(id)).then();
    }

    @action("Create story")
    createStory(data: CreateStoryWithFile): void {
        firstValueFrom(this.writerApiService.createStory(data)).then();
    }

    @action("Add sentence translation to paragraph")
    submitSentenceTranslationForParagraph(paragraph: CreateParagraphTranslationDto) {
        firstValueFrom(this.writerApiService.submitSentenceTranslationForParagraph(paragraph)).then();
    }

    @action("Add word translation to paragraph")
    submitWordTranslationForParagraph(wordTranslation: CreateWordTranslationForParagraphDto) {
        firstValueFrom(this.writerApiService.submitWordTranslationForParagraph(wordTranslation)).then();
    }

    @action("Add word to dictionary")
    submitDictionaryWord(word: CreateDictionaryWordDto) {
        firstValueFrom(this.writerApiService.submitDictionaryWord(word)).then();
    }

    @action("Get translation for word")
    getTranslationForWord(word: string) {
        firstValueFrom(this.writerApiService.getTranslationForWord(word)).then();
    }

    @action("Clear list of possbiel dictionary words")
    clearPossibleDictionaryWordList() {
        this.writerStore.onResetDictionaryWord();
    }
}