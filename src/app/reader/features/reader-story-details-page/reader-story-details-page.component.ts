import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ReaderStoryDetailsDataService } from '@reader/features/reader-story-details-page/reader-story-details-data.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component(
    {
        selector       : 'app-reader-story-details-page',
        standalone     : false,
        template       : `
            <div class="reader" *ngIf="dataService.data$ | async as data">
                <app-loading-bar [visible]="data.loading"></app-loading-bar>

                <div class="reader__toolbar">
                    <app-slider
                        leftLabel="Word"
                        rightLabel="Sentence"
                        [leftOption]="wordView"
                        [rightOption]="sentenceView"
                        [checked]="selected === sentenceView"
                        (onChange)="setSelected($event)">
                    </app-slider>

                    <mat-paginator class="reader__pager"
                                   [length]="data.paragraphs?.totalItems"
                                   [pageSize]="10"
                                   [pageSizeOptions]="[10]"
                                   (page)="handlePageEvent($event)"
                                   [hidePageSize]="true"
                                   aria-label="Select page">
                    </mat-paginator>
                </div>

                <div class="reader__surface">
                    <app-sentence-display-component
                        *ngIf="selected === sentenceView"
                        [paragraphs]="data.paragraphs?.paragraphs"></app-sentence-display-component>
                    <app-word-display-component
                        *ngIf="selected === wordView"
                        [paragraphs]="data.paragraphs?.paragraphs"></app-word-display-component>
                </div>
            </div>
        `,
        styles         : [
            `
                .reader {
                    min-height: 100%;
                    background: var(--reader-bg);
                }

                .reader__toolbar {
                    position: sticky;
                    top: 0;
                    z-index: 2;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 20px;
                    background: var(--reader-panel);
                    border-bottom: 1px solid var(--reader-line);
                }

                .reader__pager {
                    margin-left: auto;
                    background: transparent;
                }

                .reader__surface {
                    padding: 32px 20px 64px;
                }
            `
        ],
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
