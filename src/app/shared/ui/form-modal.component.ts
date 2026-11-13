import { NgIf } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ButtonModule } from "./buttons/button.module";
import { SaveButtonComponent } from "./buttons/save-button.component";
import { CancelButtonComponent } from "./buttons/cancel-button.component";
import { DeleteButtonComponent } from "./buttons/delete-button.component";

@Component({
  standalone: true,
  selector: 'app-form-modal',
  template: `
    <h1 mat-dialog-title class="modal__title">{{ title }}</h1>
    <div mat-dialog-content class="modal__content">
      <ng-content></ng-content>
    </div>
    <div *ngIf="showActionButtons" mat-dialog-actions class="modal__actions">
      <app-delete-button
        appButton
        *ngIf="showDeleteButton"
        [disabled]="loading"
        (onClick)="onDeleteBtnClick.emit()"
      ></app-delete-button>
      <span class="modal__spacer"></span>
      <app-cancel-button
        appButton
        [disabled]="loading"
        (onClick)="onCancelBtnClick.emit()"
      ></app-cancel-button>
      <app-save-button
        appButton
        [disabled]="loading"
        (onClick)="onSaveBtnClick.emit()"
      ></app-save-button>
    </div>
  `,
  styles: [
    `
      .modal__title {
        font-family: var(--font-ui);
        font-size: 19px;
        font-weight: 700;
        color: var(--reader-ink);
      }

      .modal__content {
        padding-top: 6px;
      }

      .modal__actions {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 24px 16px;
      }

      .modal__spacer {
        flex: 1 1 auto;
      }
    `,
  ],
  imports: [
    MatDialogModule,
    NgIf,
    DeleteButtonComponent,
    SaveButtonComponent,
    CancelButtonComponent,
    ButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormModalComponent {
  @Input()
  title!: string;

  @Input()
  loading!: boolean;

  @Input()
  showActionButtons = true;

  @Input()
  showDeleteButton = false;

  @Output()
  onCancelBtnClick = new EventEmitter();

  @Output()
  onSaveBtnClick = new EventEmitter();

  @Output()
  onDeleteBtnClick = new EventEmitter();
}
