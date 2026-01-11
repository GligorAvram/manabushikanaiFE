import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { ModalService } from '@shared/features/modal/modal.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { StoryCreateFormModalData } from '@writer/config/writer.interfaces';
import { CreateStoryWithFile, StoryCreateFormModalComponent } from '@writer/ui/story-create-form-modal.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { of } from 'rxjs';
import { WriterStoryListDataService } from './writer-story-list-data.service';

@Component( {
                selector       : 'app-writer-story-list-page',
                standalone     : false,
                template       : `
                    <app-header>
                        <app-title
                            headerLeft
                            title="Story management page"
                            [icon]="icon.Stories"
                        ></app-title>
                    </app-header>
                    <app-primary-button
                        appButton
                        label="Add new story"
                        [icon]="icon.Add"
                        (onClick)="openStoryCreateFormModal()"
                    ></app-primary-button>

                    <app-container *ngIf="dataService.data$ | async as data">
                        <app-story-list-table
                            [stories]="data.stories"
                            [loading]="data.loading"
                            (onRowClick)="navigationService.writerStoryDetails($event?.id!)"
                        ></app-story-list-table>
                    </app-container>
                `,
                providers      : [ WriterStoryListDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class WriterStoryListPageComponent implements OnInit {
    icon = IconEnum;

    constructor(
        public readonly dataService: WriterStoryListDataService,
        public readonly navigationService: NavigationService,
        public readonly modalService: ModalService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    openStoryCreateFormModal(): void {
        this.modalService.openMdModal<StoryCreateFormModalData>(
            StoryCreateFormModalComponent,
            this,
            {
                loading$: of( false ),
                onSubmit: this.createStory.bind( this ),
                onCancel: this.closeStoryCreateFormModal.bind( this )
            }
        );
    }

    createStory(data: CreateStoryWithFile): void {
        this.dataService.create( data );
        this.onCreateStorySuccess();
    }

    onCreateStorySuccess() {
        this.closeStoryCreateFormModal();
    }

    closeStoryCreateFormModal(): void {
        this.modalService.close( StoryCreateFormModalComponent );
    }
}
