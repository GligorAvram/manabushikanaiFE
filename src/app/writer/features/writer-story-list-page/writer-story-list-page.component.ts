import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { ModalService } from '@shared/features/modal/modal.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { ManageTagsModalData, StoryCreateFormModalData } from '@writer/config/writer.interfaces';
import { ManageTagsFormModalComponent } from '@writer/ui/manage-tags-form-modal.component';
import { CreateStoryWithFiles, StoryCreateFormModalComponent } from '@writer/ui/story-create-form-modal.component';
import { StoryDto } from 'app/models/Api';
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
                            [showTags]="true"
                            [manageableTags]="true"
                            (onRowClick)="navigationService.writerStoryDetails($event?.id!)"
                            (onManageTags)="openManageTagsModal($event)"
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

    createStory(data: CreateStoryWithFiles): void {
        this.dataService.create( data );
        this.onCreateStorySuccess();
    }

    onCreateStorySuccess() {
        this.closeStoryCreateFormModal();
    }

    closeStoryCreateFormModal(): void {
        this.modalService.close( StoryCreateFormModalComponent );
    }

    openManageTagsModal(story: StoryDto): void {
        this.modalService.openMdModal<ManageTagsModalData>(
            ManageTagsFormModalComponent,
            this,
            {
                title            : `Tags for "${ story.name }"`,
                tags$            : this.dataService.storyTags$( story.id ),
                suggestions$     : this.dataService.tagSuggestions$,
                searchSuggestions: (name: string) => this.dataService.searchTagSuggestions( name ),
                onAdd            : (name: string) => this.dataService.addTagToStory( story.id, name ),
                onRemove         : (tag) => this.dataService.removeTagFromStory( story.id, tag.id ),
                onClose          : this.closeManageTagsModal.bind( this )
            }
        );
    }

    closeManageTagsModal(): void {
        this.modalService.close( ManageTagsFormModalComponent );
    }
}
