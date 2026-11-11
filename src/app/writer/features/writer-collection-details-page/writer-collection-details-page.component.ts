import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { ModalService } from '@shared/features/modal/modal.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { AddStoryToCollectionFormData, AddStoryToCollectionFormModalData } from '@writer/config/writer.interfaces';
import { AddStoryToCollectionFormModalComponent } from '@writer/ui/add-story-to-collection-form-modal.component';
import { StoryDto } from 'app/models/Api';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { of } from 'rxjs';
import { WriterCollectionDetailsDataService } from './writer-collection-details-data.service';

@Component( {
                selector       : 'app-writer-collection-details-page',
                standalone     : false,
                template       : `
                    <app-container *ngIf="dataService.data$ | async as data">
                        <app-loading-bar [visible]="data.loading"></app-loading-bar>

                        <app-header>
                            <app-title
                                headerLeft
                                [title]="data.collection ? data.collection.name : 'Collection'"
                                [icon]="icon.Collections"
                            ></app-title>
                        </app-header>
                        <p *ngIf="data.collection?.japaneseName" class="subtitle">
                            {{ data.collection!.japaneseName }}
                        </p>
                        <p *ngIf="data.collection?.description" class="subtitle">
                            {{ data.collection!.description }}
                        </p>

                        <app-container>
                            <h3>Stories in this collection</h3>
                            <em *ngIf="stories.length === 0">No stories yet. Add one below.</em>
                            <div
                                cdkDropList
                                (cdkDropListDropped)="drop($event)"
                                class="story-list"
                            >
                                <div class="story-row" *ngFor="let story of stories; let i = index" cdkDrag>
                                    <mat-icon cdkDragHandle class="drag-handle">{{ icon.DragHandle }}</mat-icon>
                                    <span class="order">{{ i + 1 }}.</span>
                                    <span class="name">{{ story.name }}</span>
                                    <span class="spacer"></span>
                                    <app-delete-button
                                        appButton
                                        (onClick)="removeStory(story)"
                                    ></app-delete-button>
                                </div>
                            </div>
                        </app-container>

                        <app-primary-button
                            appButton
                            label="Add a story"
                            [icon]="icon.Add"
                            (onClick)="openAddStoryModal()"
                        ></app-primary-button>
                    </app-container>
                `,
                styles         : [
                    `
                        .subtitle {
                            margin: 0 0 0 10px;
                            color: #5b5b5b;
                        }

                        .story-list {
                            display: flex;
                            flex-direction: column;
                        }

                        .story-row {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            padding: 8px 10px;
                            border: 1px solid #e0e0e0;
                            border-radius: 4px;
                            margin-bottom: 6px;
                            background: #fff;
                        }

                        .drag-handle {
                            cursor: move;
                            color: #979797;
                        }

                        .order {
                            font-weight: bold;
                            color: #5b5b5b;
                        }

                        .spacer {
                            flex: 1 1 auto;
                        }

                        .cdk-drag-preview {
                            box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2);
                        }

                        .cdk-drag-placeholder {
                            opacity: 0.3;
                        }
                    `
                ],
                providers      : [ WriterCollectionDetailsDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class WriterCollectionDetailsPageComponent implements OnInit {
    icon = IconEnum;
    stories: StoryDto[] = [];

    constructor(
        public readonly dataService: WriterCollectionDetailsDataService,
        public readonly navigationService: NavigationService,
        public readonly modalService: ModalService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
        this.dataService.source?.stories
            .pipe( takeUntilDestroy( this ) )
            .subscribe( (stories) => (this.stories = [ ...stories ]) );
    }

    drop(event: CdkDragDrop<StoryDto[]>): void {
        if( event.previousIndex === event.currentIndex ) {
            return;
        }
        moveItemInArray( this.stories, event.previousIndex, event.currentIndex );
        this.dataService.reorderStories( this.stories.map( (story) => story.id ) );
    }

    openAddStoryModal(): void {
        this.modalService.openMdModal<AddStoryToCollectionFormModalData>(
            AddStoryToCollectionFormModalComponent,
            this,
            {
                stories$: this.dataService.source!.uncategorizedStories,
                search  : this.dataService.searchUncategorizedStories.bind( this.dataService ),
                loading$: of( false ),
                onSubmit: this.addStory.bind( this ),
                onCancel: this.closeAddStoryModal.bind( this )
            }
        );
    }

    addStory(data: AddStoryToCollectionFormData): void {
        if( !data.storyId ) {
            return;
        }
        this.dataService.addStory( data.storyId );
    }

    closeAddStoryModal(): void {
        this.modalService.close( AddStoryToCollectionFormModalComponent );
    }

    removeStory(story: StoryDto): void {
        this.dataService.removeStory( story.id );
    }
}
