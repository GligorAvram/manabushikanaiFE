import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, AfterViewInit, Output, EventEmitter, ViewChild, Host } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule, MatInput } from "@angular/material/input";
import { InputViewComponent } from "./input-view.component";
import { InputDirective } from "./input.directive";
import { InputModule } from "./input.module";

@Component({
  standalone: true,
  selector: 'app-text-input',
  template: `
    <mat-form-field
      appearance="outline"
      *ngIf="!input.showInputView; else inputView"
    >
      <mat-label>{{ input.label }}</mat-label>
      <input
        matInput
        [(ngModel)]="input.value"
        [required]="input.required"
        [disabled]="input.disabled"
        [class.disabled]="input.disabled"
        [errorStateMatcher]="input.errorStateMatcher"
        (input)="input.onChange($any($event.target).value)"
        (keyup)="onKeyUp($event)"
        (blur)="input.onTouch()"
        (focus)="input.inputFocused()"
      />
      <mat-hint *ngIf="input.hint">{{ input.hint }}</mat-hint>
      <mat-error>
        <ul class="error-list">
          <li *ngFor="let err of input.errors">{{ err }}</li>
        </ul>
      </mat-error>
    </mat-form-field>
    <ng-template #inputView>
      <app-input-view
        [data]="{ value: input.value, type: 'string' }"
        [label]="input.label"
        (onClick)="input.inputViewClicked()"
      ></app-input-view>
    </ng-template>
  `,
  styles:[
    `
    mat-form-field{
      width: 100%;
      padding-top:5px;
    }
    `
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    InputModule,
    InputViewComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent implements AfterViewInit {
  @Output()
  keyUp = new EventEmitter<KeyboardEvent>();

  @ViewChild(MatInput)
  matInput!: MatInput;

  constructor(@Host() public readonly input: InputDirective<string>) {}

  ngAfterViewInit(): void {
    this.input.inputElement = this.matInput;
  }

  onKeyUp(event: KeyboardEvent): void {
    this.keyUp.emit(event);
  }
}
