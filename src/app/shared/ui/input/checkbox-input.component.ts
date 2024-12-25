import {CommonModule} from "@angular/common";
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatError, MatHint} from "@angular/material/input";
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  standalone: true,
  selector: 'app-checkbox-input',
  template: `
    <mat-checkbox
      [formControl]="control"
      [required]="required"
      [class.disabled]="control.disabled"
    >
      {{ label }}
    </mat-checkbox>
    <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
    <mat-error *ngIf="control.invalid && control.touched">
      <ul class="error-list">
        <li *ngFor="let error of getErrors()">{{ error }}</li>
      </ul>
    </mat-error>
  `,
  imports: [
    CommonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatHint,
    MatError,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxInputComponent {
  @Output()
  keyUp = new EventEmitter<KeyboardEvent>();

  @Input() label = '';
  @Input() required = false;
  @Input() hint?: string;

  @Input() control!: FormControl<boolean | null | undefined>;

  constructor() {}

  onKeyUp(event: KeyboardEvent): void {
    this.keyUp.emit(event);
  }

  getErrors(): string[] {
    return Object.keys(this.control.errors || {}).map(
      (key) => this.control.errors![key]
    );
  }
}
