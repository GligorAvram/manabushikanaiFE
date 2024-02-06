import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { valueIsEmpty } from "@shared/functions";
import { ISelectInputOption, SelectInputOptions } from "./select-input.component";

export type InputValueType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'selectInputOption'
  | 'selectInputOptionArray'
  | 'password';


@Component({
  standalone: true,
  selector: 'app-input-view',
  template: `
    <div
      class="d-flex flex-column align-items-start justify-content-start input-view"
      (click)="clicked()"
    >
      <span class="input-view-label">{{ label }}</span>
      <span>{{ displayValue }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputViewComponent<T> {
  @Input()
  label!: string;

  @Input()
  set data(data: { value: T; type: InputValueType }) {
    this.displayValue = this.getDisplayValue(data);
  }

  @Output()
  onClick = new EventEmitter<void>();

  displayValue: string = '';

  clicked(): void {
    this.onClick.emit();
  }

  private getDisplayValue({
    value,
    type,
  }: {
    value: T;
    type: InputValueType;
  }): string {
    // @ts-ignore
    if (valueIsEmpty(value)) {
      return '-';
    }

    switch (type) {
      case 'string':
        return value as string;
      case 'number':
        return (value as number).toString();
      case 'boolean':
        return (value as boolean) ? 'Yes' : 'No';
      case 'selectInputOption':
        return (value as ISelectInputOption).name;
      case 'selectInputOptionArray':
        return (value as SelectInputOptions).map((v) => v.name).join(', ');
      case 'array':
        return (value as Array<any>).join(', ');
      case 'password':
        return '********';
      default:
        return '-';
    }
  }
}
