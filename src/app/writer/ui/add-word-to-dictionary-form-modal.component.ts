import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ComponentInstance, FormFields, SubmitFn} from "@shared/config/constants/shared.types";
import {AbstractForm} from "@shared/models/abstract-form";

import {UntilDestroy} from "ngx-reactivetoolkit";
import {of} from "rxjs";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedPipesModule} from "@shared/pipes/shared-pipes.module";
import {FormModalComponent} from "@shared/ui/form-modal.component";
import {InputModule} from "@shared/ui/input/input.module";
import {TextInputComponent} from "@shared/ui/input/text-input.component";
import {CheckboxInputComponent} from "@shared/ui/input/checkbox-input.component";
import {CreateDictionaryWordDto, PitchAccentEnum} from "@models/Api";
import {CreateDictionaryWordFormModalData} from "@writer/config/writer.interfaces";
import {TextNullableInputComponent} from "@shared/ui/input/text-nullable-input.component";
import {WriterPipesModule} from "@writer/pipes/writer-pipes.module";
import {EnumSelectInputComponent} from "@shared/ui/input/enum-select-input.component";
import {MultiValueInputComponent} from "@shared/ui/input/multi-value-input.component";

@Component({
  selector: 'app-add-word-to-dictionary-form-modal',
  standalone: true,
  template: `
    <app-form-modal
      title="Add word to dictionary"
      [loading]="loading"
      (onSaveBtnClick)="submit()"
      (onCancelBtnClick)="cancel()"
    >
      <form [formGroup]="form">
        <app-text-input
          class="displayBlock"
          appInput
          label="Dictionary word"
          [control]="form.controls.dictionaryWord"
        ></app-text-input>
        <app-text-input
          class="displayBlock"
          appInput
          label="English translation"
          [control]="form.controls.englishTranslation"
        ></app-text-input>
        <app-text-input
          class="displayBlock"
          appInput
          label="Japanese definition"
          [control]="form.controls.japaneseDefinition"
        ></app-text-input>
        <app-text-input
          class="displayBlock"
          appInput
          label="Kana writing"
          [control]="form.controls.kana"
        ></app-text-input>
        <app-text-nullable-input
          class="displayBlock"
          appInput
          label="Observation"
          [control]="form.controls.observation!"
        ></app-text-nullable-input>
        <app-enum-select-input
          class="displayBlock"
          appInput
          [enumType]="PitchAccentEnum"
          label="Pitch accent"
          [control]="form.controls.pitchAccent"
        ></app-enum-select-input>
        <app-checkbox-input
          class="displayBlock"
          appInput
          label="Is a set phrase"
          [control]="form.controls.isSetPhrase"
        ></app-checkbox-input>
        <app-multi-value-input
          class="displayBlock"
          appInput
          label="Alternative writings"
          [control]="form.controls.alternativeWritings"
        ></app-multi-value-input>
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
  imports: [
    TextInputComponent,
    SharedPipesModule,
    FormModalComponent,
    ReactiveFormsModule,
    InputModule,
    CheckboxInputComponent,
    TextNullableInputComponent,
    WriterPipesModule,
    EnumSelectInputComponent,
    MultiValueInputComponent
  ],
})
@UntilDestroy()
export class AddWordToDictionaryFormModalComponent extends AbstractForm<CreateDictionaryWordDto> {
  override loading: boolean = false;
  override onSubmit: SubmitFn<CreateDictionaryWordDto>;
  override initialValues: any = null;
  protected readonly PitchAccentEnum = PitchAccentEnum;

  ngOnInit(): void {
    this.init();
  }

  override cancel(): void {
    super.cancel();
    this.data.onCancel();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: CreateDictionaryWordFormModalData,
  ) {
    super({ loadingSrc$: of(false) });
    this.onSubmit = (formData: {
      dictionaryWord: string;
      englishTranslation: string;
      japaneseDefinition: string;
      kana: string;
      pitchAccent: PitchAccentEnum,
      observation?: string;
      isSetPhrase: boolean;
      alternativeWritings: string[]
    }) => data.onSubmit(formData);
  }

  protected override componentInstance(): ComponentInstance | null {
    return this;
  }

  protected override formFields(): FormFields<CreateDictionaryWordDto> {
    return {
      dictionaryWord: '',
      englishTranslation: '',
      japaneseDefinition: '',
      kana: '',
      observation: '',
      isSetPhrase: false,
      pitchAccent: PitchAccentEnum.NONE,
      alternativeWritings: []
    };
  }
}
