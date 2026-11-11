import { Injectable } from '@angular/core';
import { action } from '@shared/data/store.decorators';
import { CreateStoryWithFiles } from '@writer/ui/story-create-form-modal.component';
import { CreateCollectionDto, CreateDictionaryWordDto, CreateParagraphTranslationDto, CreateTagDto, CreateWordTranslationForParagraphDto, PageableDto, ReorderCollectionDto } from 'app/models/Api';
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

    @action( 'Load all collections' )
    loadAllCollections(): void {
        firstValueFrom( this.writerApiService.getAllCollections() )
            .then();
    }

    @action( 'Create collection' )
    createCollection(data: CreateCollectionDto): void {
        firstValueFrom( this.writerApiService.createCollection( data ) )
            .then();
    }

    @action( 'Load collection' )
    loadCollection(collectionId: string): void {
        firstValueFrom( this.writerApiService.getCollection( collectionId ) )
            .then();
    }

    @action( 'Load uncategorized stories' )
    loadUncategorizedStories(name?: string): void {
        firstValueFrom( this.writerApiService.getUncategorizedStories( name ) )
            .then();
    }

    @action( 'Add story to collection' )
    addStoryToCollection(collectionId: string, storyId: string): void {
        firstValueFrom( this.writerApiService.addStoryToCollection( collectionId, storyId ) )
            .then();
    }

    @action( 'Remove story from collection' )
    removeStoryFromCollection(collectionId: string, storyId: string): void {
        firstValueFrom( this.writerApiService.removeStoryFromCollection( collectionId, storyId ) )
            .then();
    }

    @action( 'Reorder collection stories' )
    reorderCollectionStories(collectionId: string, data: ReorderCollectionDto): void {
        firstValueFrom( this.writerApiService.reorderCollectionStories( collectionId, data ) )
            .then();
    }

    @action( 'Load all tags' )
    loadAllTags(name?: string): void {
        firstValueFrom( this.writerApiService.getAllTags( name ) )
            .then();
    }

    @action( 'Create tag' )
    createTag(data: CreateTagDto): void {
        firstValueFrom( this.writerApiService.createTag( data ) )
            .then();
    }

    @action( 'Edit tag' )
    editTag(tagId: string, data: CreateTagDto): void {
        firstValueFrom( this.writerApiService.editTag( tagId, data ) )
            .then();
    }

    @action( 'Delete tag' )
    deleteTag(tagId: string): void {
        firstValueFrom( this.writerApiService.deleteTag( tagId ) )
            .then();
    }

    @action( 'Add tag to story' )
    addTagToStory(storyId: string, data: CreateTagDto): void {
        firstValueFrom( this.writerApiService.addTagToStory( storyId, data ) )
            .then();
    }

    @action( 'Remove tag from story' )
    removeTagFromStory(storyId: string, tagId: string): void {
        firstValueFrom( this.writerApiService.removeTagFromStory( storyId, tagId ) )
            .then();
    }

    @action( 'Add tag to collection' )
    addTagToCollection(collectionId: string, data: CreateTagDto): void {
        firstValueFrom( this.writerApiService.addTagToCollection( collectionId, data ) )
            .then();
    }

    @action( 'Remove tag from collection' )
    removeTagFromCollection(collectionId: string, tagId: string): void {
        firstValueFrom( this.writerApiService.removeTagFromCollection( collectionId, tagId ) )
            .then();
    }
}
