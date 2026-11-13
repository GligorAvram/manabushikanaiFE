import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { IconEnum } from "@shared/config/enums/icon.enum";

@Component({
  standalone: true,
  selector: 'app-title',
  template: `
    <div class="title">
      <mat-icon *ngIf="icon" class="title__icon">{{ icon }}</mat-icon>
      <div *ngIf="!icon">
        <ng-content select="[titleLeft]"></ng-content>
      </div>
      <div class="title__text">
        <div class="title__row">
          <h1 class="title__heading">{{ title }}</h1>
          <ng-content select="[titleRight]"></ng-content>
        </div>
        <h2
          *ngIf="subtitle"
          class="title__subtitle"
          [innerHTML]="subtitle"
        ></h2>
        <ng-content select="[customSubtitle]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .title {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .title__icon {
        color: var(--reader-accent);
        flex: 0 0 auto;
      }

      .title__text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .title__row {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .title__heading {
        margin: 0;
        font-family: var(--font-ui);
        font-size: 20px;
        font-weight: 700;
        line-height: 1.2;
        color: var(--reader-ink);
      }

      .title__subtitle {
        margin: 0;
        font-family: var(--font-ui);
        font-size: 14px;
        font-weight: 400;
        color: var(--reader-ink-soft);
      }
    `,
  ],
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent {
  @Input()
  title!: string;

  @Input()
  subtitle?: string;

  @Input()
  icon?: IconEnum;
}
