import {CommonModule,} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output,} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {MatFormFieldModule,} from '@angular/material/form-field';
import {MatInputModule,} from '@angular/material/input';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule,} from '@angular/material/chips';
import {MatIconModule,} from '@angular/material/icon';
import {COMMA, ENTER} from "@angular/cdk/keycodes";

@Component({
  standalone: true,
  selector: 'app-multi-value-input',
  template: `
    <mat-form-field class="multi-value-input" appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <mat-chip-grid #chipGrid aria-label="Enter fruits">
        @for (value of control.value; track value) {
          <mat-chip-row
            (removed)="remove()"
          >
            {{ value }}
            <button matChipRemove [attr.aria-label]="'remove ' + value">
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip-row>
        }
        <input
          [matChipInputFor]="chipGrid"
          [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
          [matChipInputAddOnBlur]="addOnBlur"
          (matChipInputTokenEnd)="add($event)"
        />
      </mat-chip-grid>
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
      .multi-value-input mat-chip-list {
        display: flex;
        flex-wrap: wrap;
      }

      .multi-value-input input {
        min-width: 120px;
        flex: 1;
      }
    `,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiValueInputComponent {

  @Input() label = '';
  @Input() hint?: string;
  @Input() placeholder = 'Enter a value';
  @Input()
  control: FormControl<string[] | null | undefined> = new FormControl([]);

  @Output() valuesChange = new EventEmitter<string[]>();

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly addOnBlur = true;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.control.value ?
        this.control.setValue([...this.control.value!, value]) :
        this.control.setValue([value])
    }
    console.log(this.control)
    event.chipInput!.clear();
  }

  remove(): void {

  }

  edit(value: string, event: MatChipEditedEvent) {

  }

  getErrors(): string[] {
    return Object.keys(this.control.errors || {}).map(
      (key) => this.control.errors![key]
    );
  }
}
