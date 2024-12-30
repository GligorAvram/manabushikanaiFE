import {CommonModule} from "@angular/common";
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormControl} from "@angular/forms";

@Component({
  standalone: true,
  selector: 'app-single-file-upload',
  template: `
    <input
      #fileInput
      hidden="hidden"
      type="file"
      [accept]="accept"
      (change)="onFileChange($event)"
    />
    <button
      mat-stroked-button
      color="primary"
      [disabled]="disabled"
      [class.disabled]="disabled"
      (click)="fileInput.click()"
    >
      <mat-icon>file_upload</mat-icon>
      <span class="mx-1">{{ label }}</span>
    </button>
    <div *ngIf="showSummary" style="margin: 0" class="py-2">
      <span *ngIf="control.getRawValue()">{{ control.getRawValue()?.name ?? "No file selected" }}</span>
    </div>
  `,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleFileUploadComponent {
  @Input()
  label: string = 'Upload file';

  @Input()
  accept: string = '*/*';

  @Input()
  acceptMultiple = false;

  @Input()
  disabled = false;

  @Input()
  showSummary = false;

  @Output()
  onUpload = new EventEmitter<any>();

  @Output()
  fileSelected = new EventEmitter<File>();

  // uploadedFiles: File[] = [];
  @Input() control!: FormControl<File | null>;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    this.control.setValue(file);
    if (file) {
      this.fileSelected.emit(file);
    }
  }
}
