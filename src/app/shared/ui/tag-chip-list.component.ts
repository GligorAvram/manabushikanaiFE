import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TagDto } from '@models/Api';

@Component( {
                selector  : 'app-tag-chip-list',
                standalone: true,
                template  : `
                    <mat-chip-set aria-label="Tags">
                        @for (tag of tags; track tag.id) {
                            <mat-chip
                                [class.clickable]="clickable"
                                [disableRipple]="!clickable"
                                (click)="chipClicked(tag)"
                            >
                                {{ tag.name }}
                                @if (removable) {
                                    <button
                                        class="remove-btn"
                                        type="button"
                                        aria-label="Remove tag"
                                        (click)="removeClicked($event, tag)"
                                    >
                                        <mat-icon>close</mat-icon>
                                    </button>
                                }
                            </mat-chip>
                        }
                    </mat-chip-set>
                `,
                styles    : [
                    `
                        .clickable {
                            cursor: pointer;
                        }

                        .remove-btn {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            border: none;
                            background: transparent;
                            padding: 0;
                            margin-left: 6px;
                            cursor: pointer;
                            color: inherit;
                        }

                        .remove-btn mat-icon {
                            font-size: 18px;
                            width: 18px;
                            height: 18px;
                        }
                    `
                ],
                imports   : [
                    CommonModule,
                    MatChipsModule,
                    MatIconModule
                ]
            } )
export class TagChipListComponent {
    @Input()
    tags: TagDto[] = [];

    @Input()
    removable = false;

    @Input()
    clickable = false;

    @Output()
    onRemove = new EventEmitter<TagDto>();

    @Output()
    onTagClick = new EventEmitter<TagDto>();

    chipClicked(tag: TagDto): void {
        if( this.clickable ) {
            this.onTagClick.emit( tag );
        }
    }

    removeClicked(event: Event, tag: TagDto): void {
        event.stopPropagation();
        this.onRemove.emit( tag );
    }
}
