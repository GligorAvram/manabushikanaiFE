import {CommonModule,} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output,} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {MatFormFieldModule,} from '@angular/material/form-field';
import {MatInputModule,} from '@angular/material/input';
import {MatSelectModule,} from '@angular/material/select';
import {InputModule,} from './input.module';

@Component({
  standalone: true,
  selector: 'app-enum-select-input',
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <mat-select [formControl]="control">
        <mat-option *ngFor="let option of enumOptions" [value]="option.key">
          {{ option.value }}
        </mat-option>
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
export class EnumSelectInputComponent {

  @Output()
  keyUp = new EventEmitter<KeyboardEvent>();

  @Input() label = '';
  @Input() required = false;
  @Input() hint?: string;

  @Input() control!: FormControl<string | number | null>;
  enumOptions: { key: string; value: string | number }[] = [];

  constructor() {
  }

  @Input() set enumType(enumObj: object) {
    this.enumOptions = Object.entries(enumObj).map(([key, value]) => ({
      key,
      value,
    }));
  }

  getErrors(): string[] {
    return Object.keys(this.control.errors || {}).map(
      (key) => this.control.errors![key]
    );
  }
}
