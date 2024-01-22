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
    <h1 mat-dialog-title>{{ title }}</h1>
    <div mat-dialog-content class="pt-1">
      <ng-content></ng-content>
    </div>
    <div *ngIf="showActionButtons" class="w-100" mat-dialog-actions>
      <div class="d-flex align-items-center justify-content-between w-100">
        <app-delete-button
          appButton
          *ngIf="showDeleteButton"
          [disabled]="loading"
          (onClick)="onDeleteBtnClick.emit()"
        ></app-delete-button>
        <div *ngIf="!showDeleteButton"></div>
        <div class="d-flex align-items-center justify-content-end">
          <app-cancel-button
            appButton
            style="margin-right: 10px"
            [disabled]="loading"
            (onClick)="onCancelBtnClick.emit()"
          ></app-cancel-button>
          <app-save-button
            appButton
            [disabled]="loading"
            (onClick)="onSaveBtnClick.emit()"
          ></app-save-button>
        </div>
      </div>
    </div>
  `,
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
