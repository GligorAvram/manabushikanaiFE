import { Injectable } from '@angular/core';
import { action } from '@shared/data/store.decorators';
import { CreateStoryWithFiles } from '@writer/ui/story-create-form-modal.component';
import { CreateDictionaryWordDto, CreateParagraphTranslationDto, CreateWordTranslationForParagraphDto, PageableDto } from 'app/models/Api';
import { firstValueFrom } from 'rxjs';
import { WriterApiService } from './writer-api.service';
import { WriterStore } from './writer.store';

@Injectable()
export class WriterActions {
    constructor(
        private readonly writerApiService: WriterApiService,
        private readonly writerStore: WriterStore
    ) {
    }

    @action( 'Load all stories' )
    loadAllStories(): void {
        firstValueFrom( this.writerApiService.getAllStories() )
            .then();
    }

    @action( 'Load story by id' )
    loadStoryById(id: string): void {
        firstValueFrom( this.writerApiService.getStoryById( id ) )
            .then();
    }

    @action( 'Create story' )
    createStory(data: CreateStoryWithFiles): void {
        firstValueFrom( this.writerApiService.createStory( data ) )
            .then();
    }

    @action( 'Add translation to paragraph' )
    submitTranslationForSentence(paragraphTranslation: CreateParagraphTranslationDto) {
        firstValueFrom(
            this.writerApiService.submitTranslationForSentence( paragraphTranslation )
        )
            .then();
    }

    @action( 'Add word to dictionary' )
    submitDictionaryWord(word: CreateDictionaryWordDto) {
        firstValueFrom( this.writerApiService.submitDictionaryWord( word ) )
            .then();
    }

    @action( 'Load paragraphs for story' )
    loadParagraphs(storyId: string, page: PageableDto) {
        firstValueFrom( this.writerApiService.getPaginatedParagraphs( storyId, page ) )
            .then();
    }

    @action( 'Get translation for word' )
    getTranslationForWord(word: string) {
        firstValueFrom( this.writerApiService.getTranslationForWord( word ) )
            .then();
    }

    @action( 'Add word translation to paragraph' )
    submitWordTranslationForParagraph(data: CreateWordTranslationForParagraphDto) {
        firstValueFrom( this.writerApiService.submitWordTranslationForParagraph( data ) )
            .then();
    }

    @action( 'Publish story' )
    publishStory(id: string) {
        firstValueFrom( this.writerApiService.publishStory( id ) )
            .then();
    }

    clearPossibleDictionaryWordList() {
        this.writerStore.resetDictionaryWordsList();
    }

    @action( 'Generate sentence translation with AI' )
    generateSentenceTranslationWithAI(paragraphId: string): void {
        firstValueFrom( this.writerApiService.generateSentenceTranslationWithAI( paragraphId ) )
            .then();
    }

    @action( 'Generate word translation with AI' )
    generateWordTranslationWithAI(paragraphId: string): void {
        firstValueFrom( this.writerApiService.generateWordTranslationWithAI( paragraphId ) )
            .then();
    }
}
