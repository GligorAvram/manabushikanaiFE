import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentInstance, FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { SharedPipesModule } from '@shared/pipes/shared-pipes.module';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { EnumSelectInputComponent } from '@shared/ui/input/enum-select-input.component';
import { InputModule } from '@shared/ui/input/input.module';
import { SingleFileUploadComponent } from '@shared/ui/input/single-file-upload.component';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { TextNullableInputComponent } from '@shared/ui/input/text-nullable-input.component';
import { StoryCreateFormModalData } from '@writer/config/writer.interfaces';
import { CreateStoryDto, StoryDifficultyEnum } from 'app/models/Api';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { of } from 'rxjs';

export type CreateStoryWithFile = CreateStoryDto & { file: File, image: File }

@Component( {
                selector  : 'app-story-create-modal-form',
                standalone: true,
                template  : `
                    <app-form-modal
                        title="Create a new story"
                        [loading]="loading"
                        (onSaveBtnClick)="submit()"
                        (onCancelBtnClick)="cancel()"
                    >
                        <form [formGroup]="form">
                            <app-text-input
                                class="displayBlock"
                                appInput
                                label="Story name"
                                [control]="form.controls.name"
                                formControlName="name"
                            ></app-text-input>
                            <app-text-input
                                class="displayBlock"
                                appInput
                                label="Japanese name"
                                [control]="form.controls.japaneseName"
                                formControlName="japaneseName"
                            ></app-text-input>
                            <app-text-nullable-input
                                class="displayBlock"
                                appInput
                                label="Story description"
                                [control]="form.controls.description!"
                                formControlName="description"
                            ></app-text-nullable-input>
                            <app-text-nullable-input
                                class="displayBlock"
                                appInput
                                label="Japanese description"
                                [control]="form.controls.japaneseDescription!"
                                formControlName="japaneseDescription"
                            ></app-text-nullable-input>
                            <app-text-nullable-input
                                class="displayBlock"
                                appInput
                                label="Story origin"
                                [control]="form.controls.storyOrigin!"
                                formControlName="storyOrigin"
                            ></app-text-nullable-input>
                            <app-enum-select-input
                                class="displayBlock"
                                appInput
                                formControlName="difficulty"
                                label="Difficulty"
                                [enumType]="DifficultyEnum"
                                [control]="form.controls.difficulty"
                                [required]="true"
                            >
                            </app-enum-select-input>
                            <app-single-file-upload
                                label="Select file"
                                appInput
                                accept="application/txt"
                                formControlName="file"
                                [showSummary]="true"
                                [control]="form.controls.file"
                            >
                            </app-single-file-upload>
                            <app-single-file-upload
                                label="Thumbnail"
                                appInput
                                formControlName="image"
                                accept="image/*"
                                [showSummary]="true"
                                [control]="form.controls.image"
                            ></app-single-file-upload>
                        </form>
                    </app-form-modal>
                `,
                styles    : [
                    `
                        .displayBlock {
                            display: block;
                            width: 100%;
                        }
                    `
                ],
                imports   : [
                    TextInputComponent,
                    SharedPipesModule,
                    FormModalComponent,
                    ReactiveFormsModule,
                    InputModule,
                    SingleFileUploadComponent,
                    EnumSelectInputComponent,
                    TextNullableInputComponent
                ]
            } )
@UntilDestroy()
export class StoryCreateFormModalComponent extends AbstractForm<CreateStoryWithFile> {
    override initialValues?: null | undefined;
    override loading: boolean = false;
    override onSubmit: SubmitFn<CreateStoryWithFile>;
    protected readonly DifficultyEnum = StoryDifficultyEnum;

    constructor(
        @Inject( MAT_DIALOG_DATA )
        public readonly data: StoryCreateFormModalData
    ) {
        super( { loadingSrc$: of( false ) } );
        this.onSubmit = (formData: {
            name: string,
            japaneseName: string,
            description?: string,
            japaneseDescription?: string,
            storyOrigin?: string,
            difficulty: StoryDifficultyEnum,
            file: File,
            image: File
        }) => data.onSubmit( formData );
    }

    ngOnInit(): void {
        this.init();
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    protected override componentInstance(): ComponentInstance | null {
        return this;
    }

    protected override formFields(): FormFields<CreateStoryWithFile> {
        return {
            name               : '',
            japaneseName       : '',
            description        : '',
            japaneseDescription: '',
            storyOrigin        : '',
            difficulty         : StoryDifficultyEnum.EASIEST,
            file               : [],
            image              : []
        };
    }
}
