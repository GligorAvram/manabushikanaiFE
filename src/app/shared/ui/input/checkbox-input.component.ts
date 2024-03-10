import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, AfterViewInit, ViewChild, Host } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatInput } from "@angular/material/input";
import { InputViewComponent } from "./input-view.component";
import { InputDirective } from "./input.directive";
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  standalone: true,
  selector: 'app-checkbox-input',
  template: `
    <mat-checkbox
      *ngIf="!input.showInputView; else inputView"
      [(ngModel)]="input.value"
      [checked]="input.value"
      [required]="input.required"
      [disabled]="input.disabled"
      labelPosition="after"
      (change)="input.onChange($event.checked)"
      >{{ input.label }}</mat-checkbox
    >
    <ng-template #inputView>
      <app-input-view
        [data]="{ value: input.value, type: 'boolean' }"
        [label]="input.label"
        (onClick)="input.inputViewClicked()"
      ></app-input-view>
    </ng-template>
  `,
  imports: [CommonModule, MatCheckboxModule, FormsModule, InputViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxInputComponent implements AfterViewInit {
  @ViewChild(MatInput)
  matInput!: MatInput;

  constructor(@Host() public readonly input: InputDirective<boolean>) {}

  ngAfterViewInit(): void {
    this.input.inputElement = this.matInput;
  }
}
