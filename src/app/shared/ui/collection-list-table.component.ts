import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { valueIsNotEmpty } from '@shared/functions';
import { CollectionDto } from 'app/models/Api';
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
                styleUrl       : './table.scss',
                changeDetection: ChangeDetectionStrategy.OnPush,
                standalone     : true,
                imports        : [
                    LoadingBarComponent,
                    CommonModule,
                    MatTableModule
                ]
            } )
export class CollectionListTableComponent implements OnInit {
    @Input()
    collections!: CollectionDto[];

    @Input()
    loading!: boolean;

    @Output()
    onRowClick = new EventEmitter<CollectionDto | undefined>();

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
        this.columns = [ 'name', 'japaneseName', 'description' ];
    }
}
