import { NgIf } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({
  standalone: true,
  selector: 'app-loading-bar',
  template: `
    <div class="loading-container">
      <mat-progress-bar *ngIf="visible" mode="indeterminate"></mat-progress-bar>
    </div>
  `,
  styles: [
    `
      .loading-container {
        height: 4px;
      }
    `,
  ],
  imports: [MatProgressBarModule, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingBarComponent {
  @Input()
  visible!: boolean;
}
