import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {UntilDestroy} from "ngx-reactivetoolkit";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {valueIsNotEmpty} from "@shared/functions";

@Component({
  selector: 'app-search-dropdown-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
  ],
  template: `
    <mat-form-field class="search-dropdown" appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <input
        type="text"
        matInput
        [placeholder]="placeholder"
        [formControl]="searchControl"
        [matAutocomplete]="auto"
        (input)="onInput()"
      />
      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onSelect($event.option.value)">
        <mat-option *ngFor="let option of searchResults" [value]="option">
          {{ displayFn(option) }}
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: [
    `
      .search-dropdown {
        width: 100%;
      }
    `,
  ],
})
@UntilDestroy()
export class Search_dropdownInputComponent<T extends { id: string }> {
  @Input() label = 'Search';
  @Input() placeholder = 'Type to search...';
  @Input() control!: FormControl<any>;
  @Input() searchResults: T[] = [];
  @Input() clearOptionsListAfterSearch: boolean = true;
  @Output() search = new EventEmitter<string>();
  @Output() clearOptionsList = new EventEmitter();
  searchControl = new FormControl<string>('');

  @Input() displayFn: (item: T) => string = () => '';

  onInput(): void {
    if (valueIsNotEmpty(this.searchControl.value)) {
      this.search.emit(this.searchControl.value);
    } else if (this.clearOptionsListAfterSearch) {
      this.clearOptionsList.emit();
    }
  }

  onSelect(option: T): void {
    this.control.setValue(option.id);
    this.searchControl.setValue(this.displayFn(option), {emitEvent: false});
    if (this.clearOptionsListAfterSearch) {
      this.clearOptionsList.emit();
    }
  }
}
