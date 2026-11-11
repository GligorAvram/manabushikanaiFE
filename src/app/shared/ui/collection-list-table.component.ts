import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { valueIsNotEmpty } from '@shared/functions';
import { TagChipListComponent } from '@shared/ui/tag-chip-list.component';
import { CollectionDto, TagDto } from 'app/models/Api';
import { LoadingBarComponent } from './loading-bar.component';

@Component( {
                selector       : 'app-collection-list-table',
                template       : `
                    <app-loading-bar [visible]="loading"></app-loading-bar>
                    <ng-container *ngIf="collections.length > 0 && !loading; else noData">
                        <table mat-table [dataSource]="collections">
                            <ng-container matColumnDef="name">
                                <th mat-header-cell *matHeaderCellDef>Name</th>
                                <td mat-cell *matCellDef="let collection">
                                    <strong>{{ collection.name }}</strong>
                                </td>
                            </ng-container>
                            <ng-container matColumnDef="japaneseName">
                                <th mat-header-cell *matHeaderCellDef>Japanese name</th>
                                <td mat-cell *matCellDef="let collection">
                                    {{ collection.japaneseName }}
                                </td>
                            </ng-container>
                            <ng-container matColumnDef="description">
                                <th mat-header-cell *matHeaderCellDef>Description</th>
                                <td mat-cell *matCellDef="let collection">
                                    {{ collection.description }}
                                </td>
                            </ng-container>
                            <ng-container matColumnDef="tags">
                                <th mat-header-cell *matHeaderCellDef>Tags</th>
                                <td mat-cell *matCellDef="let collection" (click)="$event.stopPropagation()">
                                    <div class="tags-cell">
                                        <app-tag-chip-list
                                            [tags]="collection.tags ?? []"
                                            [clickable]="clickableTags"
                                            (onTagClick)="onTagClick.emit($event)"
                                        ></app-tag-chip-list>
                                        <button
                                            *ngIf="manageableTags"
                                            mat-icon-button
                                            type="button"
                                            aria-label="Manage tags"
                                            (click)="onManageTags.emit(collection)"
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
                        <em>No collections</em>
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
                    MatTableModule,
                    MatButtonModule,
                    MatIconModule,
                    TagChipListComponent
                ]
            } )
export class CollectionListTableComponent implements OnInit {
    @Input()
    collections!: CollectionDto[];

    @Input()
    loading!: boolean;

    @Input()
    showTags = false;

    @Input()
    manageableTags = false;

    @Input()
    clickableTags = false;

    @Output()
    onRowClick = new EventEmitter<CollectionDto | undefined>();

    @Output()
    onManageTags = new EventEmitter<CollectionDto>();

    @Output()
    onTagClick = new EventEmitter<TagDto>();

    protected readonly tagIcon = IconEnum.Tag;
    columns: string[] = [];

    ngOnInit(): void {
        this.setColumns();
    }

    rowClicked(collection: CollectionDto): void {
        if( valueIsNotEmpty( collection ) ) {
            this.onRowClick.emit( collection );
        }
    }

    private setColumns(): void {
        this.columns = this.showTags
            ? [ 'name', 'japaneseName', 'description', 'tags' ]
            : [ 'name', 'japaneseName', 'description' ];
    }
}
