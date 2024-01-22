import { NgIf, NgForOf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatSidenavModule} from "@angular/material/sidenav";
import { MatListModule} from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule, Router } from "@angular/router";
import { AppR } from "@shared/config/constants/routes";
import { IconEnum } from "@shared/config/enums/icon.enum";

type MenuGroup = {
  title: string;
  entries: MenuEntry[];
};
type MenuEntry = {
  title: string;
  routerLink: string;
  icon: IconEnum;
};

@Component({
  standalone: true,
  selector: 'app-side-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav class="sidenav" mode="side" [opened]="true">
        <ng-container *ngFor="let group of menuGroups; let index = index">
          <ng-container>
            <span class="menu-group-title">{{ group.title }}</span>
            <mat-nav-list>
              <ng-container *ngFor="let entry of group.entries">
                <a
                  mat-list-item
                  [routerLink]="entry.routerLink"
                  [class.active-list-item]="isEntryActive(entry)"
                  style="font-size: 13px; color: #5b5b5b;"
                >
                  <mat-icon style="margin-right: 10px;" matListItemIcon>{{
                    entry.icon
                  }}</mat-icon>
                  <span>{{ entry.title }}</span>
                </a>
              </ng-container>
            </mat-nav-list>
            <mat-divider *ngIf="index < menuGroups.length - 1"></mat-divider>
          </ng-container>
        </ng-container>
      </mat-sidenav>
      <mat-sidenav-content class="container py-4">
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      mat-sidenav-content {
        width: 100%;
        margin-right: 0 !important;
      }

      a.active-list-item {
        background: rgba(206, 218, 255, 0.58);
        color: #3f51b5 !important;
        font-weight: bold;
      }

      a.disabled {
        background: none;
        color: rgba(206, 218, 255, 0.58) !important;
      }

      a.active-list-item:hover {
        background: rgba(206, 218, 255, 0.58);
      }

      .sidenav-container {
        position: absolute;
        top: 50px;
        bottom: 10px;
        left: 0;
        right: 0;
      }

      .sidenav {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 250px;
        background: #fff;
        padding-top: 7px;
      }

      :host ::ng-deep {
        .mat-mdc-list-base .mat-mdc-list-item.mat-list-item-with-avatar,
        .mat-list-base .mat-list-option.mat-list-item-with-avatar {
          height: 45px;
        }

        .mat-drawer-side {
          border-right: none;
        }

        .mat-drawer-content {
          background: #f6f6f6 !important;
        }

        .mat-mdc-list-item.mdc-list-item--with-leading-avatar.mdc-list-item--with-one-line,
        .mat-mdc-list-item.mdc-list-item--with-leading-checkbox.mdc-list-item--with-one-line,
        .mat-mdc-list-item.mdc-list-item--with-leading-icon.mdc-list-item--with-one-line {
          height: 40px;
        }
      }

      .menu-group-title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #979797;
        font-weight: bold;
        padding-left: 10px;
        font-size: 13px;
        margin-top: 10px;
      }

      @media (min-width: 1400px) {
        .container-xxl,
        .container-xl,
        .container-lg,
        .container-md,
        .container-sm,
        .container {
          max-width: calc(100% - 250px);
        }
      }
    `,
  ],
  imports: [
    MatSidenavModule,
    MatListModule,
    RouterModule,
    NgIf,
    NgForOf,
    MatIconModule,
  ],
})
export class SideMenuComponent {
  constructor(private readonly router: Router) {}

  get menuGroups(): MenuGroup[] {
    return [
      {
        title: 'Main',
        // oneOfPermissions: [],
        entries: [
          {
            title: 'Dashboard',
            routerLink: AppR.dashboard.full,
            icon: IconEnum.Dashboard,
            // requiredPermissions: [],
          },
          {
            title: 'Profile',
            routerLink: AppR.profile.full,
            icon: IconEnum.Profile,
            // requiredPermissions: [],
          },
          {
            title: 'Settings',
            routerLink: AppR.settings.full,
            icon: IconEnum.Settings,
            // requiredPermissions: [],
          },
        ],
      },
      {
        title: 'Reader',
        // oneOfPermissions: [],
        entries: [
          {
            title: 'Stories',
            routerLink: AppR.reader.stories.list.full,
            icon: IconEnum.Stories,
            // requiredPermissions: [],
          },
        ],
      },
      {
        title: 'Writer',
        entries: [
          {
            title: 'Stories',
            routerLink: AppR.writer.list.full,
            icon: IconEnum.Stories,
            // requiredPermissions: [],
          },
        ],
      },
    ];
  }

  isEntryActive(entry: MenuEntry): boolean {
    return this.router.url.includes(entry.routerLink);
  }
}
