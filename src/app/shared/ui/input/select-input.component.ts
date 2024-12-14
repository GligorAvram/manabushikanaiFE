import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output,} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {InputModule} from './input.module';

export interface ISelectInputOption {
  id: string;
  name: string;
  description?: string;
  discriminator: 'ISelectInputOption';
}

export type SelectInputOptions = ISelectInputOption[];

@Component({
  standalone: true,
  selector: 'app-select-input',
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <mat-select>
        @for (option of control.getRawValue(); track option) {
          <mat-option [value]="option.id">
            {{ option.name }}
          </mat-option>
        }
      </mat-select>
      <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
      <mat-error *ngIf="control.invalid && control.touched">
        <ul class="error-list">
          <li *ngFor="let error of getErrors()">{{ error }}</li>
        </ul>
      </mat-error>
    </mat-form-field>
  `,
  styles: [
    `
      input {
        height: 40px;
        padding-left: 10px;
      }

      .list-option-container {
        position: relative;
        line-height: 10px;
        padding-bottom: 7px;
      }

      .list-option-description {
        font-size: 11px;
        margin-left: 16px;
        position: absolute;
        bottom: 0;
        pointer-events: none;
        padding-bottom: 7px;
      }
    `,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    InputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectInputComponent {

  @Output()
  keyUp = new EventEmitter<KeyboardEvent>();

  @Input() label = '';
  @Input() required = false;
  @Input() hint?: string;

  @Input() control!: FormControl<SelectInputOptions>;

  constructor() {
  }

  getErrors(): string[] {
    return Object.keys(this.control.errors || {}).map(
      (key) => this.control.errors![key]
    );
  }
}
