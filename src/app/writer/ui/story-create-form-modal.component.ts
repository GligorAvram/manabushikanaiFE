import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ComponentInstance, FormFields, SubmitFn } from "@shared/config/constants/shared.types";
import { AbstractForm } from "@shared/models/abstract-form";
import { CreateStoryDto } from "app/models/Api";
import { UntilDestroy } from "ngx-reactivetoolkit";
import { of } from "rxjs";
import { SelectInputComponent } from "@shared/ui/input/select-input.component";
import { DifficultyEnum } from "@shared/config/enums/difficulty.enum";
import { SharedPipesModule } from "@shared/pipes/shared-pipes.module";
import { FormModalComponent } from "@shared/ui/form-modal.component";
import { ReactiveFormsModule } from "@angular/forms";
import { InputModule } from "@shared/ui/input/input.module";
import { StoryCreateFormModalData } from "@writer/config/writer.interfaces";
import { TextInputComponent } from "@shared/ui/input/text-input.component";


@Component({
  selector: 'app-story-create-modal-form',
  standalone: true,
  template: `
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
          formControlName="name"
        ></app-text-input>
        <app-select-input
          appInput
          formControlName="difficulty"
          label="Difficulty"
          [options]="difficultyEnum | enumToSelectInputOptions"
          [required]="true"
        >
        </app-select-input>
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
    SelectInputComponent,
    TextInputComponent,
    SharedPipesModule,
    FormModalComponent,
    ReactiveFormsModule,
    InputModule,
  ],
})
@UntilDestroy()
export class StoryCreateFormModalComponent extends AbstractForm<
  CreateStoryDto,
  string[]
> {
  override loading: boolean = false;
  override onSubmit: SubmitFn<CreateStoryDto>;
  override initialValues?: string[];
  difficultyEnum = DifficultyEnum;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: StoryCreateFormModalData,
  ) {
    super({ loadingSrc$: of(false) });
    this.initialValues = [];
    this.onSubmit = (formData: { name?: string; difficulty?: number }) => data.onSubmit(formData)
  }

  ngOnInit(): void {
    this.init();
  }

  override cancel(): void {
    super.cancel();
    this.data.onCancel();
  }

  protected override formFields(): FormFields<CreateStoryDto> {
    return {
      name: '',
      difficulty: 0,
    };
  }

  protected override componentInstance(): ComponentInstance | null {
    return this;
  }
}