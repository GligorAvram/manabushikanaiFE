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
                                placeholder="Search for a story..."
                                [control]="form.controls.storyId"
                                [searchResults]="searchResults"
                                [displayFn]="displayStory"
                                (search)="onSearch($event)"
                                (clearOptionsList)="applyFilter()"
                            ></app-search-dropdown-input>
                            <em *ngIf="allStories.length === 0" class="empty">
                                No more stories available to add.
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

                        .empty {
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
    allStories: StoryDto[] = [];
    searchResults: StoryDto[] = [];

    @ViewChild( SearchDropdownInputComponent )
    private readonly dropdown?: SearchDropdownInputComponent<StoryDto>;

    private query = '';

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
                this.allStories = stories;
                this.applyFilter();
            } );
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    displayStory = (story: StoryDto): string => story.name;

    onSearch(query: string): void {
        this.query = query;
        this.applyFilter();
    }

    applyFilter(): void {
        const normalized = this.query.trim().toLowerCase();
        this.searchResults = normalized
            ? this.allStories.filter( (story) => story.name.toLowerCase().includes( normalized ) )
            : [ ...this.allStories ];
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
        this.data.onSubmit( formData );
        this.query = '';
        this.dropdown?.clear();
        this.form.reset();
    }
}
