import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { ButtonModule } from '@shared/ui/buttons/button.module';
import { PrimaryButtonComponent } from '@shared/ui/buttons/primary-button.component';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { SearchDropdownInputComponent } from '@shared/ui/input/search-dropdown-input.component';
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
                            <app-search-dropdown-input
                                class="tag-input"
                                label="Add a tag"
                                placeholder="Type a tag name..."
                                [control]="nameControl"
                                [searchResults]="(suggestions$ | async) ?? []"
                                [displayFn]="displayTag"
                                [valueFn]="tagName"
                                [minSearchLength]="3"
                                [clearOptionsListAfterSearch]="false"
                                (search)="onSearch($event)"
                                (textChange)="nameControl.setValue($event)"
                                (enter)="add()"
                            ></app-search-dropdown-input>
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
                            font-family: var(--font-ui);
                            font-size: 13px;
                            color: var(--reader-muted);
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
                    SearchDropdownInputComponent,
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

    @ViewChild( SearchDropdownInputComponent )
    private readonly dropdown?: SearchDropdownInputComponent<TagDto>;

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

    displayTag = (tag: TagDto): string => tag.name;
    tagName = (tag: TagDto): string => tag.name;

    onSearch(value: string): void {
        // The dropdown only emits once the 3-char minimum is met.
        this.data.searchSuggestions( value.trim() );
    }

    add(): void {
        const name = this.nameControl.value?.trim();
        if( !name ) {
            return;
        }
        this.data.onAdd( name );
        this.dropdown?.clear();
        this.nameControl.setValue( '' );
    }

    remove(tag: TagDto): void {
        this.data.onRemove( tag );
    }

    close(): void {
        this.data.onClose();
    }
}
