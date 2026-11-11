import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { CollectionDto } from '@models/Api';
import { valueIsNotEmpty } from '@shared/functions';
import { ContainerComponent } from '@shared/ui/container.component';

@Component( {
                selector  : 'app-collection-list-cards',
                standalone: true,
                template  : `
                    <app-container>
                        <mat-grid-list cols="5" rowHeight="250px" gutterSize="10">
                            @for (collection of collections; track collection.id) {
                                <mat-grid-tile>
                                    <mat-card class="collection-card" appearance="outlined" (click)="cardClicked(collection)">
                                        <mat-card-content>
                                            <mat-card-title>{{ collection.name }}</mat-card-title>
                                            <mat-card-subtitle>{{ collection.japaneseName }}</mat-card-subtitle>
                                            <p>{{ collection.description }}</p>
                                        </mat-card-content>
                                    </mat-card>
                                </mat-grid-tile>
                            }
                        </mat-grid-list>
                    </app-container>`,
                styles    : [
                    `
                        .collection-card {
                            height: 250px;
                            width: 100%;
                            cursor: pointer;
                        }
                    `
                ],
                imports   : [
                    ContainerComponent,
                    CommonModule,
                    MatCardModule,
                    MatButtonModule,
                    MatGridList,
                    MatGridTile
                ]
            } )
export class CollectionListCardComponent {
    @Input()
    collections!: CollectionDto[];

    @Output()
    onCardClick: EventEmitter<CollectionDto> = new EventEmitter();

    @Input()
    loading: boolean = true;

    cardClicked(collection: CollectionDto): void {
        if( valueIsNotEmpty( collection ) ) {
            this.onCardClick.emit( collection );
        }
    }
}
