import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Host,
  Input,
  Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { valueIsNotEmpty } from '@shared/functions';
import { InputDirective } from '@shared/ui/input/input.directive';
import { InputViewComponent } from './input-view.component';
import { InputModule } from './input.module';

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
    <mat-form-field
      appearance="outline"
      *ngIf="!input.showInputView; else inputView"
    >
      <mat-label>{{ input.label }}</mat-label>
      <mat-select
        [(ngModel)]="input.value"
        [disabled]="input.disabled"
        [required]="input.required"
        [class.disabled]="input.disabled"
        [errorStateMatcher]="input.errorStateMatcher"
        (selectionChange)="onSelectionChange($event)"
        (blur)="input.onTouch()"
        (focus)="input.inputFocused()"
      >
        <ng-container *ngIf="!optionsLoading; else loading">
          <input
            *ngIf="enableSearch"
            placeholder="Search..."
            type="text"
            [(ngModel)]="searchQuery"
            (keyup)="onSearch($any($event.target).value)"
          />
          <ng-container *ngIf="filteredOptions.length > 0">
            <mat-option *ngIf="!input.required"><em>None</em></mat-option>
            <div
              *ngFor="let option of filteredOptions"
              class="list-option-container"
            >
              <mat-option [value]="option.id">
                {{ option.name }}
              </mat-option>
              <em
                *ngIf="option.description"
                [innerHTML]="option.description"
                class="list-option-description"
              ></em>
            </div>
          </ng-container>
        </ng-container>
        <ng-template #loading>
          <mat-option [disabled]="true"><em>Loading...</em></mat-option>
        </ng-template>
      </mat-select>
      <mat-hint *ngIf="input.hint">{{ input.hint }}</mat-hint>
      <mat-error *ngIf="input.errors.length > 0">
        <ul class="error-list">
          <li *ngFor="let error of input.errors">{{ error }}</li>
        </ul>
      </mat-error>
    </mat-form-field>
    <ng-template #inputView>
      <app-input-view
        [data]="{ value: valueToDisplay(), type: 'selectInputOption' }"
        [label]="input.label"
        (onClick)="input.inputViewClicked()"
      ></app-input-view>
    </ng-template>
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
    InputViewComponent,
    ReactiveFormsModule,
    MatInputModule,
    InputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectInputComponent {
  @Input()
  set options(value: SelectInputOptions) {
    this.initialOptions = value;
    this.filteredOptions = valueIsNotEmpty(value) ? value.slice() : [];
  }

  @Input()
  optionsLoading!: boolean;

  @Input()
  enableSearch = false;

  @Output()
  onSelect = new EventEmitter<string>();

  initialOptions: SelectInputOptions = [];
  filteredOptions: SelectInputOptions = [];
  searchQuery: string | null = null;

  constructor(@Host() public readonly input: InputDirective<string | null>) {}

  onSelectionChange(event: MatSelectChange): void {
    this.input.onChange(event.value);
    this.onSelect.emit(event.value);
    this.searchQuery = null;
    this.onSearch('');
  }

  valueToDisplay(): ISelectInputOption {
    return this.filteredOptions.find((o) => o.id === this.input.value)!;
  }

  onSearch(query: string): void {
    if (this.enableSearch && valueIsNotEmpty(query)) {
      const filter = (option: ISelectInputOption): boolean =>
        option.name.toLowerCase().includes(query.trim().toLowerCase());
      this.filteredOptions = valueIsNotEmpty(query)
        ? this.initialOptions?.filter(filter) ?? []
        : this.initialOptions?.slice() ?? [];
    }

    if (valueIsNotEmpty(query)) {
      this.filteredOptions = this.initialOptions?.slice() ?? [];
    }
  }
}
