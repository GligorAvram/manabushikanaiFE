import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { ButtonModule } from '@shared/ui/buttons/button.module';
import { PrimaryButtonComponent } from '@shared/ui/buttons/primary-button.component';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { TagChipListComponent } from '@shared/ui/tag-chip-list.component';
import { ManageTagsModalData } from '@writer/config/writer.interfaces';
import { TagDto } from 'app/models/Api';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { combineLatest, map, Observable } from 'rxjs';

@Component( {
                selector  : 'app-manage-tags-modal-form',
                standalone: true,
                template  : `
                    <app-form-modal
                        [title]="data.title"
                        [loading]="false"
                        [showActionButtons]="false"
                    >
                        <div class="add-row">
                            <mat-form-field class="tag-input" appearance="outline">
                                <mat-label>Add a tag</mat-label>
                                <input
                                    matInput
                                    [formControl]="nameControl"
                                    [matAutocomplete]="auto"
                                    placeholder="Type a tag name..."
                                    (input)="onInput()"
                                    (keydown.enter)="add(); $event.preventDefault()"
                                />
                                <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onSuggestionSelected($event.option.value)">
                                    <mat-option *ngFor="let tag of (suggestions$ | async)" [value]="tag.name">
                                        {{ tag.name }}
                                    </mat-option>
                                </mat-autocomplete>
                            </mat-form-field>
                            <app-primary-button
                                appButton
                                label="Add"
                                [type]="'button'"
                                [icon]="icon.Add"
                                (onClick)="add()"
                            ></app-primary-button>
                        </div>

                        <ng-container *ngIf="(data.tags$ | async) ?? [] as tags">
                            <app-tag-chip-list
                                [tags]="tags"
                                [removable]="true"
                                (onRemove)="remove($event)"
                            ></app-tag-chip-list>
                            <em *ngIf="tags.length === 0" class="hint">No tags yet.</em>
                        </ng-container>

                        <div class="footer">
                            <app-primary-button
                                appButton
                                label="Done"
                                [type]="'button'"
                                [outlined]="true"
                                (onClick)="close()"
                            ></app-primary-button>
                        </div>
                    </app-form-modal>
                `,
                styles    : [
                    `
                        .add-row {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        }

                        .tag-input {
                            flex: 1 1 auto;
                        }

                        .hint {
                            display: block;
                            color: #5b5b5b;
                        }

                        .footer {
                            display: flex;
                            justify-content: flex-end;
                            margin-top: 16px;
                        }
                    `
                ],
                imports   : [
                    CommonModule,
                    ReactiveFormsModule,
                    MatFormFieldModule,
                    MatInputModule,
                    MatAutocompleteModule,
                    FormModalComponent,
                    PrimaryButtonComponent,
                    ButtonModule,
                    TagChipListComponent
                ]
            } )
@UntilDestroy()
export class ManageTagsFormModalComponent {
    readonly icon = IconEnum;
    readonly nameControl = new FormControl<string>( '', { nonNullable: true } );
    readonly suggestions$: Observable<TagDto[]>;

    constructor(
        @Inject( MAT_DIALOG_DATA )
        public readonly data: ManageTagsModalData
    ) {
        // Hide tags already on this entity from the autocomplete suggestions.
        this.suggestions$ = combineLatest( [ this.data.tags$, this.data.suggestions$ ] )
            .pipe(
                map( ([ current, suggestions ]) =>
                    suggestions.filter( (suggestion) => !current.some( (tag) => tag.id === suggestion.id ) )
                )
            );
    }

    onInput(): void {
        const value = this.nameControl.value?.trim();
        if( value && value.length >= 3 ) {
            this.data.searchSuggestions( value );
        }
    }

    onSuggestionSelected(name: string): void {
        this.nameControl.setValue( name );
    }

    add(): void {
        const name = this.nameControl.value?.trim();
        if( !name ) {
            return;
        }
        this.data.onAdd( name );
        this.nameControl.setValue( '' );
    }

    remove(tag: TagDto): void {
        this.data.onRemove( tag );
    }

    close(): void {
        this.data.onClose();
    }
}
