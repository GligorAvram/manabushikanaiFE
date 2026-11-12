import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { ContainerComponent } from "./container.component";

@Component({
  standalone: true,
  selector: 'app-header',
  template: `
    <div class="header">
      <app-container [height]="height" [loading]="loading">
        <div class="header__inner">
          <div class="header__row">
            <section class="header__left">
              <ng-content select="[headerLeft]"></ng-content>
            </section>
            <section class="header__right">
              <ng-content select="[headerRight]"></ng-content>
            </section>
          </div>
          <section>
            <ng-content select="[headerBottom]"></ng-content>
          </section>
        </div>
      </app-container>
    </div>
  `,
  styles: [
    `
      .header {
        margin-bottom: 16px;
      }

      /* Fills the card (a block div) without overflowing it: no explicit width +
         border-box so the padding stays inside the container's outline. */
      .header__inner {
        padding: 12px 16px;
        box-sizing: border-box;
      }

      .header__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .header__left {
        display: flex;
        align-items: center;
        min-width: 0;
      }

      .header__right {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
      }
    `,
  ],
  imports: [ContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input()
  loading = false;

  @Input()
  height?: string;
}
