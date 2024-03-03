import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { SentenceDto } from 'app/models/Api';
import { ContainerComponent } from '@shared/ui/container.component';
import { valueIsNotEmpty } from '@shared/functions';

export type translationData = {
  formGroup: FormGroup;
  sentence: SentenceDto;
};

@Component({
  selector: 'app-sentence-editor',
  template: ` <app-container>
    <mat-card>
      <mat-stepper [linear]="false" #stepper *ngIf="formGroups">
        <mat-step
          *ngFor="let group of formGroups; let index = index"
          [completed]="group.sentence.translationDone"
          [stepControl]="group.formGroup"
        >
          <form [formGroup]="group.formGroup">
            <ng-template matStepLabel></ng-template>
            <ng-container>{{ group.sentence.japaneseSentence }}</ng-container>
            <mat-form-field class="displayBlock">
              <mat-label>Translation</mat-label>
              <input
                matInput
                placeholder="Translation"
                formControlName="control"
                required
              />
            </mat-form-field>
            <ng-container>{{ group.sentence.englishTranslation }}</ng-container>
            <div>
              <button
                mat-button
                (click)="submitTranslation(group.formGroup, group.sentence)"
              >
                Submit
              </button>
              <button mat-button matStepperNext>Next</button>
            </div>
          </form>
        </mat-step>
        <mat-step>
          <ng-template matStepLabel>Done</ng-template>
          <p>You are now done.</p>
          <div>
            <button mat-button>Back</button>
          </div>
        </mat-step>
      </mat-stepper>
    </mat-card>
  </app-container>`,
  standalone: true,
  styles: [
    `
      .displayBlock {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ContainerComponent,
  ],
})
export class SentenceEditorComponent implements OnInit {
  @Input()
  sentences!: SentenceDto[];

  @Output()
  onTranslationSubmitted: EventEmitter<SentenceDto> = new EventEmitter();

  constructor(private _formBuilder: FormBuilder) {}
  formGroups!: translationData[];

  ngOnInit(): void {
    this.formGroups = this.generateGroups();
  }

  submitTranslation(formGroup: FormGroup, sentence: SentenceDto) {
    if (valueIsNotEmpty(formGroup.controls['control'].getRawValue())) {
      this.onTranslationSubmitted.emit({
        ...sentence,
        englishTranslation: formGroup.controls['control'].getRawValue(),
      });
    }
  }

  private generateGroups(): translationData[] {
    return this.sentences.map((sentence) => {
      return {
        formGroup: this._formBuilder.group({
          control: ['', Validators.required],
        }),
        sentence,
      };
    });
  }
}
