import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AppR } from '@shared/config/constants/routes';

@Component({
  standalone: true,
  selector: 'app-top-bar',
  template: `
    <mat-toolbar class="app-navbar shadow-sm">
      <div class="w-100 h-100">
        <div class="d-flex align-items-center justify-content-between h-100">
          <div class="d-flex align-items-center justify-content-start h-100">
            <h1
              class="m-0 p-0 text-center logo"
              style="width: 250px"
              [routerLink]="dashboardLink"
            >
              Manabi Reader
            </h1>
          </div>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [
    `
      .app-navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
        background: #fff;
        padding: 0;
        z-index: 3;
      }

      .logo {
        width: 200px;
        font-weight: bolder;
        letter-spacing: 2px;
        font-family: 'Ubuntu', sans-serif;
        cursor: pointer;
        background: #3f51b5;
        background: linear-gradient(to right, #3f51b5 8%, #ff4081 73%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .logo:hover {
        background: #ff4081;
        background: linear-gradient(to right, #ff4081 8%, #3f51b5 73%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    `,
  ],
  imports: [
    MatToolbarModule,
    RouterModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {

  get dashboardLink(): string {
    return AppR.dashboard.full;
  }
}
