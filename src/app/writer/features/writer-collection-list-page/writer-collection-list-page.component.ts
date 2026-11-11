import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { ModalService } from '@shared/features/modal/modal.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { CollectionCreateFormModalData } from '@writer/config/writer.interfaces';
import { CollectionCreateFormModalComponent } from '@writer/ui/collection-create-form-modal.component';
import { CreateCollectionDto } from 'app/models/Api';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { of } from 'rxjs';
import { WriterCollectionListDataService } from './writer-collection-list-data.service';

@Component( {
                selector       : 'app-writer-collection-list-page',
                standalone     : false,
                template       : `
                    <app-header>
                        <app-title
                            headerLeft
                            title="Collection management page"
                            [icon]="icon.Collections"
                        ></app-title>
                    </app-header>
                    <app-primary-button
                        appButton
                        label="Add new collection"
                        [icon]="icon.Add"
                        (onClick)="openCollectionCreateFormModal()"
                    ></app-primary-button>

                    <app-container *ngIf="dataService.data$ | async as data">
                        <app-collection-list-table
                            [collections]="data.collections"
                            [loading]="data.loading"
                            (onRowClick)="navigationService.writerCollectionDetails($event?.id!)"
                        ></app-collection-list-table>
                    </app-container>
                `,
                providers      : [ WriterCollectionListDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class WriterCollectionListPageComponent implements OnInit {
    icon = IconEnum;

    constructor(
        public readonly dataService: WriterCollectionListDataService,
        public readonly navigationService: NavigationService,
        public readonly modalService: ModalService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    openCollectionCreateFormModal(): void {
        this.modalService.openMdModal<CollectionCreateFormModalData>(
            CollectionCreateFormModalComponent,
            this,
            {
                loading$: of( false ),
                onSubmit: this.createCollection.bind( this ),
                onCancel: this.closeCollectionCreateFormModal.bind( this )
            }
        );
    }

    createCollection(data: CreateCollectionDto): void {
        this.dataService.create( data );
        this.closeCollectionCreateFormModal();
    }

    closeCollectionCreateFormModal(): void {
        this.modalService.close( CollectionCreateFormModalComponent );
    }
}
