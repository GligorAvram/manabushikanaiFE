import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReaderCollectionListDataService } from '@reader/features/reader-collection-list-page/reader-collection-list-data.service';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component(
    {
        selector       : 'app-reader-collection-list-page',
        standalone     : false,
        template       : `
            <app-container height="100%">
                <app-header>
                    <app-title headerLeft title="Collections" [icon]="icon.Collections"></app-title>
                </app-header>
                <app-collection-list-cards *ngIf="dataService.data$ | async as data"
                                           [collections]="data.collections"
                                           [loading]="data.loading"
                                           (onCardClick)="navigateToCollectionPage($event.id)"
                ></app-collection-list-cards>
            </app-container>
        `,
        providers      : [ ReaderCollectionListDataService ],
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
@UntilDestroy()
export class ReaderCollectionListPageComponent implements OnInit {

    icon = IconEnum;

    constructor(
        public readonly dataService: ReaderCollectionListDataService,
        public readonly navigationService: NavigationService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    navigateToCollectionPage(id: string): void {
        this.navigationService.readerCollectionDetails( id );
    }
}
