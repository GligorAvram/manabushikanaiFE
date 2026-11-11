import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentInstance, FormFields, SubmitFn } from '@shared/config/constants/shared.types';
import { AbstractForm } from '@shared/models/abstract-form';
import { SharedPipesModule } from '@shared/pipes/shared-pipes.module';
import { FormModalComponent } from '@shared/ui/form-modal.component';
import { InputModule } from '@shared/ui/input/input.module';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { TagFormModalData } from '@writer/config/writer.interfaces';
import { CreateTagDto } from 'app/models/Api';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { of } from 'rxjs';

@Component( {
                selector  : 'app-tag-modal-form',
                standalone: true,
                template  : `
                    <app-form-modal
                        [title]="data.title"
                        [loading]="loading"
                        (onSaveBtnClick)="submit()"
                        (onCancelBtnClick)="cancel()"
                    >
                        <form [formGroup]="form">
                            <app-text-input
                                class="displayBlock"
                                appInput
                                label="Tag name"
                                [control]="form.controls.name"
                                formControlName="name"
                            ></app-text-input>
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
                    InputModule
                ]
            } )
@UntilDestroy()
export class TagFormModalComponent extends AbstractForm<CreateTagDto> {
    override initialValues?: null | undefined;
    override loading: boolean = false;
    override onSubmit: SubmitFn<CreateTagDto>;

    constructor(
        @Inject( MAT_DIALOG_DATA )
        public readonly data: TagFormModalData
    ) {
        super( { loadingSrc$: of( false ) } );
        this.onSubmit = (formData: CreateTagDto) => data.onSubmit( formData );
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

    protected override formFields(): FormFields<CreateTagDto> {
        return {
            name: this.data.initialName ?? ''
        };
    }
}
