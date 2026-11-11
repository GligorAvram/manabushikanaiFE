import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReaderCollectionDetailsDataService } from '@reader/features/reader-collection-details-page/reader-collection-details-data.service';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component(
    {
        selector       : 'app-reader-collection-details-page',
        standalone     : false,
        template       : `
            <app-container height="100%" *ngIf="dataService.data$ | async as data">
                <app-header>
                    <app-title
                        headerLeft
                        [title]="data.collection ? data.collection.name : 'Collection'"
                        [icon]="icon.Collections"
                    ></app-title>
                </app-header>
                <p *ngIf="data.collection?.description" class="subtitle">
                    {{ data.collection!.description }}
                </p>
                <app-story-list-cards
                    [stories]="data.stories"
                    [loading]="data.loading"
                    (onCardClick)="navigateToStoryPage($event.id)"
                ></app-story-list-cards>
            </app-container>
        `,
        styles         : [
            `
                .subtitle {
                    margin: 0 0 0 10px;
                    color: #5b5b5b;
                }
            `
        ],
        providers      : [ ReaderCollectionDetailsDataService ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
@UntilDestroy()
export class ReaderCollectionDetailsPageComponent implements OnInit {

    icon = IconEnum;

    constructor(
        public readonly dataService: ReaderCollectionDetailsDataService,
        public readonly navigationService: NavigationService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    navigateToStoryPage(id: string): void {
        this.navigationService.readerStoryDetails( id );
    }
}
