import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageableDto, PaginatedParagraphDto, StoryDto } from '@models/Api';
import { ReaderActions } from '@reader/data/reader.actions';
import { ReaderQueries } from '@reader/data/reader.queries';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/component-data.service';
import { getParamFromRoute } from '@shared/functions';

interface ReaderStoryDetailsComponentData {
    story: StoryDto | null;
    paragraphs: PaginatedParagraphDto | null;
    loading: boolean;
}

@Injectable()
export class ReaderStoryDetailsDataService extends BaseComponentDataService<
    ReaderStoryDetailsComponentData
> {
    constructor(
        private readonly readerActions: ReaderActions,
        private readonly readerQueries: ReaderQueries,
        private readonly _route: ActivatedRoute
    ) {
        super( readerQueries );
    }

    loadParagraphs(page: PageableDto) {
        const id = getParamFromRoute( 'id', this._route );
        if( id ) {
            this.readerActions.loadParagraphs( id, page );
        }
    }

    protected override onInit(): void {
        this.loadStory();
        this.loadParagraphs( { pageNumber: 0, pageSize: 10 } );
    }

    protected dataSource(): ComponentDataSource<ReaderStoryDetailsComponentData> {
        return {
            story     : this.readerQueries.selectActiveStory(),
            paragraphs: this.readerQueries.selectParagraphs(),
            loading   : this.readerQueries.selectLoading()
        };
    }

    private loadStory() {
        const id = getParamFromRoute( 'id', this._route );
        if( id ) {
            this.readerActions.loadStoryById( id );
        }
    }
}
