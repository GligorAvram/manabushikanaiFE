import {CommonModule} from "@angular/common";
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {InputModule} from "./input.module";
import {valueIsEmpty} from "@shared/functions";

@Component({
  standalone: true,
  selector: 'app-text-nullable-input',
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        [formControl]="control"
        [required]="required"
      />
      <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
      <mat-error *ngIf="control!.invalid && control.touched">
        <ul class="error-list">
          <li *ngFor="let error of getErrors()">{{ error }}</li>
        </ul>
      </mat-error>
    </mat-form-field>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
        padding-top: 5px;
      }
    `
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    InputModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextNullableInputComponent implements OnInit {
  @Output()
  keyUp = new EventEmitter<KeyboardEvent>();

  @Input() label = '';
  @Input() required = false;
  @Input() hint?: string;

  @Input() control!: FormControl<string | null | undefined>;

  constructor() {
  }

  ngOnInit() {
    if (!this.control) {
      this.control = new FormControl<undefined>(undefined);
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    this.keyUp.emit(event);
  }

  getErrors(): string[] {
    if (valueIsEmpty(this.control)) {
      return [];
    }
    return Object.keys(this.control.errors || {}).map(
      (key) => this.control.errors![key]
    );
  }
}
