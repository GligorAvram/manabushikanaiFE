import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
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
        (keydown.enter)="onEnter($event)"
      />
      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onSelect($event.option.value)">
        <mat-option *ngFor="let option of searchResults" [value]="option">
          {{ displayFn(option) }}
        </mat-option>
      </mat-autocomplete>
      <mat-hint *ngIf="showSearchHint()">{{ searchHint() }}</mat-hint>
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
export class SearchDropdownInputComponent<T extends { id: string }> implements OnChanges {
  @Input() label = 'Search';
  @Input() placeholder = 'Type to search...';
  @Input() control!: FormControl<any>;
  @Input() searchResults: T[] = [];
  @Input() clearOptionsListAfterSearch: boolean = true;
  @Input() initialValue?: T;
  /** Minimum characters that must be typed before `search` is emitted. 0 = search on any input. */
  @Input() minSearchLength = 0;
  /** Built-in hint shown while 0 < typed length < minSearchLength. `{min}` is substituted. */
  @Input() searchHintTemplate = 'Type at least {min} characters to search.';
  /** What the bound `control` receives on selection. Defaults to the option id. */
  @Input() valueFn: (item: T) => string = (item) => item.id;
  @Output() search = new EventEmitter<string>();
  @Output() clearOptionsList = new EventEmitter();
  /** Emits the raw text on every keystroke (so callers can track free-text input). */
  @Output() textChange = new EventEmitter<string>();
  /** Emits the current text when Enter is pressed. */
  @Output() enter = new EventEmitter<string>();
  searchControl = new FormControl<string>('');

  @Input() displayFn: (item: T) => string = () => '';

  onInput(): void {
    const value = this.searchControl.value ?? '';
    this.textChange.emit(value);
    if (valueIsNotEmpty(value) && value.trim().length >= this.minSearchLength) {
      this.search.emit(value);
    } else if (this.clearOptionsListAfterSearch) {
      this.clearOptionsList.emit();
    }
  }

  onSelect(option: T): void {
    this.control.setValue(this.valueFn(option));
    this.searchControl.setValue(this.displayFn(option), {emitEvent: false});
    if (this.clearOptionsListAfterSearch) {
      this.clearOptionsList.emit();
    }
  }

  onEnter(event: Event): void {
    event.preventDefault();
    this.enter.emit(this.searchControl.value ?? '');
  }

  clear(): void {
    this.control.setValue(null);
    this.searchControl.setValue('', {emitEvent: false});
  }

  showSearchHint(): boolean {
    const length = (this.searchControl.value ?? '').trim().length;
    return this.minSearchLength > 0 && length > 0 && length < this.minSearchLength;
  }

  searchHint(): string {
    return this.searchHintTemplate.replace('{min}', String(this.minSearchLength));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["initialValue"] && this.initialValue !== undefined) {
      this.onSelect(this.initialValue!)
    }
  }
}
