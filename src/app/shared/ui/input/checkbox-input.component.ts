import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  Host,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatError, MatFormField, MatHint, MatInput, MatLabel} from "@angular/material/input";
import { InputViewComponent } from "./input-view.component";
import { InputDirective } from "./input.directive";
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  standalone: true,
  selector: 'app-checkbox-input',
  template: `
    <mat-checkbox
      [formControl]="control"
      [required]="required"
      [disabled]="control.disabled"
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

  @Input() control!: FormControl<boolean>;

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
