import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentInstance, FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { SharedPipesModule } from '@shared/pipes/shared-pipes.module';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { TextNullableInputComponent } from '@shared/ui/input/text-nullable-input.component';
import { CollectionCreateFormModalData } from '@writer/config/writer.interfaces';
import { CreateCollectionDto } from 'app/models/Api';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { of } from 'rxjs';

@Component( {
                selector  : 'app-collection-create-modal-form',
                standalone: true,
                template  : `
                    <app-form-modal
                        title="Create a new collection"
                        [loading]="loading"
                        (onSaveBtnClick)="submit()"
                        (onCancelBtnClick)="cancel()"
                    >
                        <form [formGroup]="form">
                            <app-text-input
                                class="displayBlock"
                                appInput
                                label="Collection name"
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
                                label="Description"
                                [control]="form.controls.description!"
                                formControlName="description"
                            ></app-text-nullable-input>
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
                    TextNullableInputComponent
                ]
            } )
@UntilDestroy()
export class CollectionCreateFormModalComponent extends AbstractForm<CreateCollectionDto> {
    override initialValues?: null | undefined;
    override loading: boolean = false;
    override onSubmit: SubmitFn<CreateCollectionDto>;

    constructor(
        @Inject( MAT_DIALOG_DATA )
        public readonly data: CollectionCreateFormModalData
    ) {
        super( { loadingSrc$: of( false ) } );
        this.onSubmit = (formData: CreateCollectionDto) => data.onSubmit( formData );
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

    protected override formFields(): FormFields<CreateCollectionDto> {
        return {
            name        : '',
            japaneseName: '',
            description : ''
        };
    }
}
