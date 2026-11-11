import { NgIf } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentInstance, FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { SharedPipesModule } from '@shared/pipes/shared-pipes.module';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { SearchDropdownInputComponent } from '@shared/ui/input/search-dropdown-input.component';
import { AddStoryToCollectionFormData, AddStoryToCollectionFormModalData } from '@writer/config/writer.interfaces';
import { StoryDto } from 'app/models/Api';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { of } from 'rxjs';

@Component( {
                selector  : 'app-add-story-to-collection-modal-form',
                standalone: true,
                template  : `
                    <app-form-modal
                        title="Add stories to this collection"
                        [loading]="loading"
                        (onSaveBtnClick)="submit()"
                        (onCancelBtnClick)="cancel()"
                    >
                        <form [formGroup]="form">
                            <app-search-dropdown-input
                                class="displayBlock"
                                appInput
                                label="Story"
                                placeholder="Search for a story by name..."
                                [control]="form.controls.storyId"
                                [searchResults]="searchResults"
                                [displayFn]="displayStory"
                                [clearOptionsListAfterSearch]="false"
                                (search)="onSearch($event)"
                            ></app-search-dropdown-input>
                            <em *ngIf="query.trim().length > 0 && query.trim().length < minSearchLength" class="hint">
                                Type at least {{ minSearchLength }} characters to search.
                            </em>
                            <em *ngIf="query.trim().length >= minSearchLength && searchResults.length === 0" class="hint">
                                No stories found.
                            </em>
                        </form>
                    </app-form-modal>
                `,
                styles    : [
                    `
                        .displayBlock {
                            display: block;
                            width: 100%;
                        }

                        .hint {
                            display: block;
                            color: #5b5b5b;
                        }
                    `
                ],
                imports   : [
                    NgIf,
                    SearchDropdownInputComponent,
                    SharedPipesModule,
                    FormModalComponent,
                    ReactiveFormsModule,
                    InputModule
                ]
            } )
@UntilDestroy()
export class AddStoryToCollectionFormModalComponent extends AbstractForm<AddStoryToCollectionFormData> {
    override initialValues?: null | undefined;
    override loading: boolean = false;
    override onSubmit: SubmitFn<AddStoryToCollectionFormData>;
    readonly minSearchLength = 3;
    searchResults: StoryDto[] = [];
    query = '';

    @ViewChild( SearchDropdownInputComponent )
    private readonly dropdown?: SearchDropdownInputComponent<StoryDto>;

    constructor(
        @Inject( MAT_DIALOG_DATA )
        public readonly data: AddStoryToCollectionFormModalData
    ) {
        super( { loadingSrc$: of( false ) } );
        this.onSubmit = (formData: AddStoryToCollectionFormData) => this.handleSubmit( formData );
    }

    ngOnInit(): void {
        this.init();
        this.data.stories$
            .pipe( takeUntilDestroy( this ) )
            .subscribe( (stories) => {
                // Ignore stale emissions while the query is below the search threshold.
                if( this.query.trim().length >= this.minSearchLength ) {
                    this.searchResults = stories;
                }
            } );
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    displayStory = (story: StoryDto): string => story.name;

    onSearch(query: string): void {
        this.query = query;
        if( query.trim().length >= this.minSearchLength ) {
            this.data.search( query );
        } else {
            this.searchResults = [];
        }
    }

    protected override componentInstance(): ComponentInstance | null {
        return this;
    }

    protected override formFields(): FormFields<AddStoryToCollectionFormData> {
        return {
            storyId: ''
        };
    }

    private handleSubmit(formData: AddStoryToCollectionFormData): void {
        if( !formData.storyId ) {
            return;
        }
        // Adds the story and resets the field; the next 3+ char search re-queries the
        // backend fresh, so the just-added (now categorized) story won't reappear.
        this.data.onSubmit( formData );
        this.query = '';
        this.searchResults = [];
        this.dropdown?.clear();
        this.form.reset();
    }
}
