import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { ModalService } from '@shared/features/modal/modal.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { CollectionCreateFormModalData, ManageTagsModalData } from '@writer/config/writer.interfaces';
import { CollectionCreateFormModalComponent } from '@writer/ui/collection-create-form-modal.component';
import { ManageTagsFormModalComponent } from '@writer/ui/manage-tags-form-modal.component';
import { CollectionDto, CreateCollectionDto } from 'app/models/Api';
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
                        <button headerRight type="button" class="add-action" (click)="openCollectionCreateFormModal()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                            New collection
                        </button>
                    </app-header>

                    <app-container *ngIf="dataService.data$ | async as data">
                        <app-collection-list-table
                            [collections]="data.collections"
                            [loading]="data.loading"
                            [showTags]="true"
                            [manageableTags]="true"
                            (onRowClick)="navigationService.writerCollectionDetails($event?.id!)"
                            (onManageTags)="openManageTagsModal($event)"
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

    openManageTagsModal(collection: CollectionDto): void {
        this.modalService.openMdModal<ManageTagsModalData>(
            ManageTagsFormModalComponent,
            this,
            {
                title            : `Tags for "${ collection.name }"`,
                tags$            : this.dataService.collectionTags$( collection.id ),
                suggestions$     : this.dataService.tagSuggestions$,
                searchSuggestions: (name: string) => this.dataService.searchTagSuggestions( name ),
                onAdd            : (name: string) => this.dataService.addTagToCollection( collection.id, name ),
                onRemove         : (tag) => this.dataService.removeTagFromCollection( collection.id, tag.id ),
                onClose          : this.closeManageTagsModal.bind( this )
            }
        );
    }

    closeManageTagsModal(): void {
        this.modalService.close( ManageTagsFormModalComponent );
    }
}
