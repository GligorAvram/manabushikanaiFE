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
        (keydown.enter)="onEnter($event)"
        (blur)="onBlur()"
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
export class SearchDropdownInputComponent<T extends { id: string }> {
  @Input() label = 'Search';
  @Input() placeholder = 'Type to search...';
  @Input() control!: FormControl<any>;
  @Input() searchResults: T[] = [];
  @Input() clearOptionsListAfterSearch: boolean = true;
  /** Minimum characters that must be typed before `search` is emitted. 0 = search on any input. */
  @Input() minSearchLength = 0;
  /** Built-in hint shown while 0 < typed length < minSearchLength. `{min}` is substituted. */
  @Input() searchHintTemplate = 'Type at least {min} characters to search.';
  /** What the bound `control` receives on selection. Defaults to the option id. */
  @Input() valueFn: (item: T) => string = (item) => item.id;
  /**
   * When true, leaving the field discards uncommitted free text and reverts the box to the
   * committed selection. Off by default so callers that use the typed text as free input
   * (e.g. "type a name + Add") keep what was typed.
   */
  @Input() revertOnBlur = false;
  @Output() search = new EventEmitter<string>();
  /** Emits the full option the user picked (not just its mapped control value). */
  @Output() optionSelected = new EventEmitter<T>();
  @Output() clearOptionsList = new EventEmitter();
  /** Emits the raw text on every keystroke (so callers can track free-text input). */
  @Output() textChange = new EventEmitter<string>();
  /** Emits the current text when Enter is pressed. */
  @Output() enter = new EventEmitter<string>();
  searchControl = new FormControl<string>('');
  /** Display text of the currently committed selection (empty when nothing is selected). */
  private lastCommittedDisplay = '';

  @Input() displayFn: (item: T) => string = () => '';

  onInput(): void {
    const value = this.searchControl.value ?? '';
    this.textChange.emit(value);
    if (valueIsNotEmpty(value) && value.trim().length >= this.minSearchLength) {
      this.search.emit(value);
    } else {
      // Clearing the box means there is nothing committed to revert to on blur.
      if (!valueIsNotEmpty(value)) {
        this.lastCommittedDisplay = '';
      }
      if (this.clearOptionsListAfterSearch) {
        this.clearOptionsList.emit();
      }
    }
  }

  onSelect(option: T): void {
    this.control.setValue(this.valueFn(option));
    this.lastCommittedDisplay = this.displayFn(option);
    this.searchControl.setValue(this.lastCommittedDisplay, {emitEvent: false});
    this.optionSelected.emit(option);
    if (this.clearOptionsListAfterSearch) {
      this.clearOptionsList.emit();
    }
  }

  /**
   * Leaving the field discards any uncommitted free text: revert the visible text to the
   * committed selection (or empty if nothing is selected). This keeps the box from showing
   * a translation that was never actually picked.
   */
  onBlur(): void {
    if (this.revertOnBlur && (this.searchControl.value ?? '') !== this.lastCommittedDisplay) {
      this.searchControl.setValue(this.lastCommittedDisplay, {emitEvent: false});
    }
  }

  /**
   * Imperatively set the visible text to a given selection (or clear it when passed
   * null/undefined). Use this when the parent switches context and needs the box to reflect
   * the new selection reliably — unlike `[initialValue]`, it is not subject to change-detection
   * reference checks, so switching between two "empty" selections still clears the box. It only
   * touches the display; the bound `control` stays under the parent's control.
   */
  showSelection(option?: T | null): void {
    this.lastCommittedDisplay = option ? this.displayFn(option) : '';
    this.searchControl.setValue(this.lastCommittedDisplay, {emitEvent: false});
  }

  onEnter(event: Event): void {
    event.preventDefault();
    this.enter.emit(this.searchControl.value ?? '');
  }

  clear(): void {
    this.control.setValue(null);
    this.lastCommittedDisplay = '';
    this.searchControl.setValue('', {emitEvent: false});
  }

  showSearchHint(): boolean {
    const length = (this.searchControl.value ?? '').trim().length;
    return this.minSearchLength > 0 && length > 0 && length < this.minSearchLength;
  }

  searchHint(): string {
    return this.searchHintTemplate.replace('{min}', String(this.minSearchLength));
  }
}
