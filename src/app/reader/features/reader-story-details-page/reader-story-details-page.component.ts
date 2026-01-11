import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ReaderStoryDetailsDataService } from '@reader/features/reader-story-details-page/reader-story-details-data.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component(
    {
        selector       : 'app-reader-story-details-page',
        standalone     : false,
        template       : `
            <app-container
                [height]="'100%'"
                *ngIf="dataService.data$ | async as data">
                <app-loading-bar [visible]="data.loading"></app-loading-bar>
                <app-slider
                    [rightOption]="sentenceView"
                    [leftOption]="wordView"
                    (onChange)="setSelected($event)"
                ></app-slider>

                <app-container *ngIf="data">
                    <div class="mat-paginator-container">
                        <mat-paginator [length]="data.paragraphs?.totalItems"
                                       [pageSize]="10"
                                       [pageSizeOptions]="[10]"
                                       (page)="handlePageEvent($event)"
                                       [hidePageSize]="true"
                                       aria-label="Select page">
                        </mat-paginator>
                    </div>

                    <app-container *ngIf="selected===sentenceView">
                        <app-sentence-display-component [paragraphs]="data.paragraphs?.paragraphs"></app-sentence-display-component>
                    </app-container>
                    <app-container *ngIf="selected===wordView">
                        <app-word-display-component [paragraphs]="data.paragraphs?.paragraphs"></app-word-display-component>
                    </app-container>
                </app-container>
            </app-container>
        `,
        providers      : [ ReaderStoryDetailsDataService ],
        changeDetection: ChangeDetectionStrategy.OnPush
    } )
@UntilDestroy()
export class ReaderStoryDetailsPageComponent implements OnInit {

    protected sentenceView = 'Sentence view';
    protected wordView = 'Word view';
    selected: string | undefined = this.wordView;

    constructor(protected readonly dataService: ReaderStoryDetailsDataService) {
    }

    ngOnInit() {
        this.dataService.init( this );
    }

    setSelected(value: string | undefined) {
        this.selected = value;
    }

    handlePageEvent($event: PageEvent) {
        this.dataService.loadParagraphs( { pageSize: 10, pageNumber: $event.pageIndex } );
    }
}
