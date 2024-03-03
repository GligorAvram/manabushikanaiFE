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
import { FileUploadComponent } from "@shared/ui/file-upload.component";

export type CreateStoryWithFile = CreateStoryDto & {file: File}

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
          class="displayBlock"
          appInput
          formControlName="difficulty"
          label="Difficulty"
          [options]="difficultyEnum | enumToSelectInputOptions"
          [required]="true"
        >
        </app-select-input>
        <app-file-upload
          label="Select file"
          accept="application/txt"
          [showSummary]="true"
          (onUpload)="onFileUpload($event)"
        >
        </app-file-upload>
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
    FileUploadComponent,
  ],
})
@UntilDestroy()
export class StoryCreateFormModalComponent extends AbstractForm<
  CreateStoryWithFile,
  string[]
> {
  override loading: boolean = false;
  override onSubmit: SubmitFn<CreateStoryWithFile>;
  override initialValues?: string[];
  difficultyEnum = DifficultyEnum;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: StoryCreateFormModalData,
  ) {
    super({ loadingSrc$: of(false) });
    this.initialValues = [];
    this.onSubmit = (formData: {
      name?: string;
      difficulty?: number;
      file: File;
    }) => data.onSubmit(formData);
  }

  ngOnInit(): void {
    this.init();
  }

  override cancel(): void {
    super.cancel();
    this.data.onCancel();
  }

  protected override formFields(): FormFields<CreateStoryWithFile> {
    return {
      name: '',
      difficulty: 0,
      file: [],
    };
  }

  protected override componentInstance(): ComponentInstance | null {
    return this;
  }

  onFileUpload(file: File): void {
    this.form.patchValue({ file: file });
  }
}