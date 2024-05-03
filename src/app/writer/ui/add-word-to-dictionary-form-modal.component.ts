import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SubmitFn, FormFields, ComponentInstance } from "@shared/config/constants/shared.types";
import { AbstractForm } from "@shared/models/abstract-form";
import { AddWordToDictionaryFormModalData } from "@writer/config/writer.interfaces";
import { CreateDictionaryWordDto, PitchAccentEnum } from 'app/models/Api';
import { UntilDestroy } from "ngx-reactivetoolkit";
import { of } from "rxjs";
import { ReactiveFormsModule, Validators } from "@angular/forms";
import { SharedPipesModule } from "@shared/pipes/shared-pipes.module";
import { FormModalComponent } from "@shared/ui/form-modal.component";
import { InputModule } from "@shared/ui/input/input.module";
import { SelectInputComponent } from "@shared/ui/input/select-input.component";
import { TextInputComponent } from "@shared/ui/input/text-input.component";
import { CheckboxInputComponent } from "../../shared/ui/input/checkbox-input.component";


@Component({
    selector: "app-create-dictionary-word-form-modal",
    standalone: true,
    template: `
        <app-form-modal title="Add word to dictionary" [loading]="loading" (onSaveBtnClick)="submit()" (onCancelBtnClick)="cancel()">
            <form [formGroup]="form">
                <app-text-input class="displayBlock" appInput label="Dictionary form" formControlName="dictionaryWord"></app-text-input>
                <app-text-input class="displayBlock" appInput label="English translation" formControlName="englishTranslation"></app-text-input>
                <app-text-input class="displayBlock" appInput label="Japanese definition" formControlName="japaneseDefinition"></app-text-input>
                <app-text-input class="displayBlock" appInput label="Kana writing" formControlName="kana"></app-text-input>
                <app-select-input class="displayBlock" appInput label="Pitch accent writing" [options]="pitchAccentEnum | enumToSelectInputOptions" formControlName="pitchAccent"></app-select-input>
                <app-text-input class="displayBlock" appInput label="Observation" formControlName="observation"></app-text-input>
                <app-checkbox-input class="displayBlock" appInput label="Is a set phrase" formControlName="isSetPhrase"></app-checkbox-input>
            </form>
        </app-form-modal>
    `,
    styles: [
        `
            .displayBlock {
                display: block;
                width: 100%;
            }
        `,
    ],
    imports: [SelectInputComponent, TextInputComponent, SharedPipesModule, FormModalComponent, ReactiveFormsModule, InputModule, CheckboxInputComponent],
})
@UntilDestroy()
export class CreateDictionaryWordFormModalComponent extends AbstractForm<CreateDictionaryWordDto> {
    override loading: boolean = false;
    override onSubmit: SubmitFn<CreateDictionaryWordDto>;
    override initialValues: any = null;
    pitchAccentEnum = PitchAccentEnum;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly data: AddWordToDictionaryFormModalData,
    ) {
        super({ loadingSrc$: of(false) });
        this.onSubmit = (formData: { dictionaryWord: string; englishTranslation: string; japaneseDefinition: string; kana: string; observation?: string; isSetPhrase?: boolean; pitchAccent: PitchAccentEnum }) => data.onSubmit(formData);
    }

    ngOnInit(): void {
        this.init();
    }

    override cancel(): void {
        super.cancel();
        this.data.onCancel();
    }

    protected override formFields(): FormFields<CreateDictionaryWordDto> {
        return {
            dictionaryWord: "",
            englishTranslation: "",
            japaneseDefinition: "",
            kana: "",
            pitchAccent: PitchAccentEnum.HEIBAN,
            observation: "",
            isSetPhrase: false,
        };
    }

    protected override componentInstance(): ComponentInstance | null {
        return this;
    }
}