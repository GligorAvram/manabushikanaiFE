import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { valueIsNotEmpty } from '@shared/functions';
import { PathImage } from '@shared/ui/path-image.component';
import { TagChipListComponent } from '@shared/ui/tag-chip-list.component';
import { WriterPipesModule } from '@writer/pipes/writer-pipes.module';
import { StoryDto, TagDto } from 'app/models/Api';
import { LoadingBarComponent } from './loading-bar.component';

@Component( {
                selector       : 'app-story-list-table',
                template       : `
                    <app-loading-bar [visible]="loading"></app-loading-bar>
                    <ng-container *ngIf="stories.length > 0 && !loading; else noData">
                        <table mat-table [dataSource]="stories">
                            <ng-container matColumnDef="name">
                                <th mat-header-cell *matHeaderCellDef>Name</th>
                                <td mat-cell *matCellDef="let story">
                                    <strong>{{ story | storyName }}</strong>
                                </td>
                            </ng-container>
                            <ng-container matColumnDef="difficulty">
                                <th mat-header-cell *matHeaderCellDef>Difficulty</th>
                                <td mat-cell *matCellDef="let story">
                                    <strong>{{ story | storyDifficulty }}</strong>
                                </td>
                            </ng-container>
                            <ng-container matColumnDef="image">
                                <th mat-header-cell *matHeaderCellDef>Thumbnail</th>
                                <td mat-cell *matCellDef="let story">
                                    <app-path-image [image]="story.image"></app-path-image>
                                </td>
                            </ng-container>
                            <ng-container matColumnDef="tags">
                                <th mat-header-cell *matHeaderCellDef>Tags</th>
                                <td mat-cell *matCellDef="let story" (click)="$event.stopPropagation()">
                                    <div class="tags-cell">
                                        <app-tag-chip-list
                                            [tags]="story.tags ?? []"
                                            [clickable]="clickableTags"
                                            (onTagClick)="onTagClick.emit($event)"
                                        ></app-tag-chip-list>
                                        <button
                                            *ngIf="manageableTags"
                                            mat-icon-button
                                            type="button"
                                            aria-label="Manage tags"
                                            (click)="onManageTags.emit(story)"
                                        >
                                            <mat-icon>{{ tagIcon }}</mat-icon>
                                        </button>
                                    </div>
                                </td>
                            </ng-container>

                            <tr mat-header-row *matHeaderRowDef="columns"></tr>
                            <tr
                                mat-row
                                *matRowDef="let row; columns: columns"
                                (click)="rowClicked(row)"
                            ></tr>
                        </table>
                    </ng-container>
                    <ng-template #noData>
                        <em>No stories</em>
                    </ng-template>
                `,
                providers      : [],
                styles         : [
                    `
                        .tags-cell {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                    `
                ],
                styleUrl       : './table.scss',
                changeDetection: ChangeDetectionStrategy.OnPush,
                standalone     : true,
                imports        : [
                    LoadingBarComponent,
                    CommonModule,
                    WriterPipesModule,
                    MatTableModule,
                    MatButtonModule,
                    MatIconModule,
                    PathImage,
                    TagChipListComponent
                ]
            } )
export class StoryListTableComponent implements OnInit {
    @Input()
    stories!: StoryDto[];

    @Input()
    loading!: boolean;

    @Input()
    showTags = false;

    @Input()
    manageableTags = false;

    @Input()
    clickableTags = false;

    @Output()
    onRowClick = new EventEmitter<StoryDto | undefined>();

    @Output()
    onManageTags = new EventEmitter<StoryDto>();

    @Output()
    onTagClick = new EventEmitter<TagDto>();

    protected readonly tagIcon = IconEnum.Tag;
    columns: string[] = [];

    ngOnInit(): void {
        this.setColumns();
    }

    rowClicked(story: StoryDto): void {
        if( valueIsNotEmpty( story ) ) {
            this.onRowClick.emit( story );
        }
    }

    private setColumns(): void {
        this.columns = this.showTags
            ? [ 'name', 'difficulty', 'image', 'tags' ]
            : [ 'name', 'difficulty', 'image' ];
    }
}
