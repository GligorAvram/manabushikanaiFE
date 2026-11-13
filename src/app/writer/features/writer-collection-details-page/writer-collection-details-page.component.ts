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
                                [subtitle]="data.collection?.japaneseName"
                                [icon]="icon.Collections"
                            ></app-title>
                            <button headerRight type="button" class="add-action" (click)="openAddStoryModal()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                                Add a story
                            </button>
                        </app-header>

                        <p *ngIf="data.collection?.description" class="lede">
                            {{ data.collection!.description }}
                        </p>

                        <section class="panel">
                            <h3 class="panel__heading">Stories in this collection</h3>
                            <p *ngIf="stories.length === 0" class="empty">No stories yet. Add one above.</p>
                            <div
                                cdkDropList
                                (cdkDropListDropped)="drop($event)"
                                class="story-list"
                            >
                                <div class="story-row" *ngFor="let story of stories; let i = index" cdkDrag>
                                    <mat-icon cdkDragHandle class="drag-handle">{{ icon.DragHandle }}</mat-icon>
                                    <span class="order">{{ i + 1 }}</span>
                                    <span class="name">{{ story.name }}</span>
                                    <span class="spacer"></span>
                                    <app-delete-button
                                        appButton
                                        (onClick)="removeStory(story)"
                                    ></app-delete-button>
                                </div>
                            </div>
                        </section>
                    </app-container>
                `,
                styles         : [
                    `
                        .lede {
                            margin: 2px 0 18px 2px;
                            max-width: 70ch;
                            font-family: var(--font-ui);
                            font-size: 14px;
                            line-height: 1.5;
                            color: var(--reader-ink-soft);
                        }

                        .panel {
                            padding: 18px 20px;
                            background: var(--reader-panel);
                            border: 1px solid var(--reader-line);
                            border-radius: var(--reader-radius);
                        }

                        .panel__heading {
                            margin: 0 0 14px;
                            font-family: var(--font-ui);
                            font-size: 13px;
                            font-weight: 600;
                            letter-spacing: .03em;
                            text-transform: uppercase;
                            color: var(--reader-muted);
                        }

                        .empty {
                            margin: 0;
                            font-family: var(--font-ui);
                            font-size: 14px;
                            color: var(--reader-muted);
                        }

                        .story-list {
                            display: flex;
                            flex-direction: column;
                            gap: 8px;
                        }

                        .story-row {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            padding: 10px 12px;
                            border: 1px solid var(--reader-line);
                            border-radius: 10px;
                            background: var(--reader-bg);
                            font-family: var(--font-ui);
                        }

                        .drag-handle {
                            cursor: move;
                            color: var(--reader-muted);
                        }

                        .order {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            flex: 0 0 auto;
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            background: var(--reader-accent-soft);
                            color: var(--reader-accent);
                            font-size: 12px;
                            font-weight: 600;
                        }

                        .name {
                            font-size: 14px;
                            font-weight: 500;
                            color: var(--reader-ink);
                        }

                        .spacer {
                            flex: 1 1 auto;
                        }

                        .cdk-drag-preview {
                            border-radius: 10px;
                            box-shadow: 0 14px 30px -16px rgba(28, 27, 24, .45);
                        }

                        .cdk-drag-placeholder {
                            opacity: 0.3;
                        }

                        .cdk-drag-animating {
                            transition: transform .2s cubic-bezier(0, 0, 0.2, 1);
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
