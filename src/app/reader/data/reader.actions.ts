import { Injectable } from '@angular/core';
import { action } from '@shared/data/store.decorators';
import { PageableDto } from '@models/Api';
import { ReaderApiService } from '@reader/data/reader-api.service';
import { ReaderStore } from '@reader/data/reader.store';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReaderActions {
    constructor(
        private readonly readerApiService: ReaderApiService,
        private readonly readerStore: ReaderStore
    ) {
    }

    @action( 'Load all stories' )
    loadAllStories(): void {
        firstValueFrom( this.readerApiService.getAllStories() )
            .then();
    }

    @action( 'Load stories by id' )
    loadStoryById(id: string) {
        firstValueFrom( this.readerApiService.getStoryById(id) )
            .then();
    }

    loadParagraphs(storyId: string, page: PageableDto): void {
        firstValueFrom(this.readerApiService.getPaginatedParagraphs(storyId, page)).then()
    }

    @action( 'Load all collections' )
    loadAllCollections(): void {
        firstValueFrom( this.readerApiService.getAllCollections() )
            .then();
    }

    @action( 'Load collection' )
    loadCollection(collectionId: string): void {
        firstValueFrom( this.readerApiService.getCollection( collectionId ) )
            .then();
    }
}
