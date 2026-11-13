import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { AppR } from '@shared/config/constants/routes';
import { IconEnum } from '@shared/config/enums/icon.enum';

type MenuEntry = {
    title: string;
    routerLink: string;
    icon: IconEnum;
};

@Component( {
                standalone     : true,
                selector       : 'app-side-menu',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template       : `
                    <mat-sidenav-container class="sidenav-container">
                        <mat-sidenav class="sidenav" mode="side" [opened]="true">
                            <div class="menu">
                                <!-- Scrollable top: browse sections -->
                                <div class="menu__scroll">
                                    <div class="menu__section">
                                        <span class="menu__title">Reader</span>
                                        <a *ngFor="let entry of readerEntries"
                                           class="menu__item"
                                           [routerLink]="entry.routerLink"
                                           routerLinkActive="menu__item--active">
                                            <mat-icon class="menu__icon">{{ entry.icon }}</mat-icon>
                                            <span class="menu__label">{{ entry.title }}</span>
                                        </a>
                                    </div>

                                    <!--
                                      Writer tools. For now we assume the editor's view, so this
                                      is always shown. TODO (accounts phase): gate on the signed-in
                                      user's role — replace the always-true 'isEditor' flag with the
                                      real permission check so plain readers don't see this section.
                                    -->
                                    @if (isEditor) {
                                        <div class="menu__section">
                                            <span class="menu__title">Writer</span>
                                            <a *ngFor="let entry of writerEntries"
                                               class="menu__item"
                                               [routerLink]="entry.routerLink"
                                               routerLinkActive="menu__item--active">
                                                <mat-icon class="menu__icon">{{ entry.icon }}</mat-icon>
                                                <span class="menu__label">{{ entry.title }}</span>
                                            </a>
                                        </div>
                                    }
                                </div>

                                <!-- Fixed bottom: account + session actions, always visible -->
                                <div class="menu__footer">
                                    <a *ngFor="let entry of accountEntries"
                                       class="menu__item"
                                       [routerLink]="entry.routerLink"
                                       routerLinkActive="menu__item--active">
                                        <mat-icon class="menu__icon">{{ entry.icon }}</mat-icon>
                                        <span class="menu__label">{{ entry.title }}</span>
                                    </a>
                                    <button type="button" class="menu__item menu__item--button" (click)="logout()">
                                        <mat-icon class="menu__icon">logout</mat-icon>
                                        <span class="menu__label">Log out</span>
                                    </button>
                                </div>
                            </div>
                        </mat-sidenav>
                        <mat-sidenav-content class="content">
                            <ng-content></ng-content>
                        </mat-sidenav-content>
                    </mat-sidenav-container>
                `,
                styles         : [
                    `
                        .sidenav-container {
                            position: absolute;
                            top: 56px;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            background: var(--reader-bg);
                        }

                        .sidenav {
                            width: 240px;
                            background: var(--reader-panel);
                        }

                        /* Let our own flex column own the height + scrolling, not Material's
                           inner container. */
                        :host ::ng-deep .sidenav .mat-drawer-inner-container {
                            height: 100%;
                            overflow: hidden;
                        }

                        .menu {
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                        }

                        .menu__scroll {
                            flex: 1 1 auto;
                            min-height: 0;
                            overflow-y: auto;
                            display: flex;
                            flex-direction: column;
                            gap: 14px;
                            padding: 12px 12px 8px;
                        }

                        .menu__footer {
                            flex: 0 0 auto;
                            display: flex;
                            flex-direction: column;
                            gap: 2px;
                            padding: 10px 12px 12px;
                            border-top: 1px solid var(--reader-line);
                            background: var(--reader-panel);
                        }

                        .menu__section {
                            display: flex;
                            flex-direction: column;
                            gap: 2px;
                        }

                        .menu__title {
                            padding: 0 12px;
                            margin-bottom: 4px;
                            font-family: var(--font-ui);
                            font-size: 11px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: .05em;
                            color: var(--reader-muted);
                            opacity: .75;
                        }

                        .menu__item {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            height: 44px;
                            padding: 0 12px;
                            border-radius: 10px;
                            text-decoration: none;
                            font-family: var(--font-ui);
                            font-size: 14px;
                            font-weight: 500;
                            color: var(--reader-ink-soft);
                            transition: background .12s ease, color .12s ease;
                        }

                        .menu__item--button {
                            width: 100%;
                            border: none;
                            background: transparent;
                            text-align: left;
                            cursor: pointer;
                        }

                        .menu__item:hover {
                            background: #f2efe6;
                            color: var(--reader-ink);
                        }

                        .menu__item--button:hover {
                            background: #f7eceb;
                            color: #b23b2e;
                        }

                        .menu__item--button:hover .menu__icon {
                            color: #b23b2e;
                        }

                        .menu__item--active {
                            background: var(--reader-accent-soft);
                            color: var(--reader-accent);
                            font-weight: 600;
                        }

                        .menu__item--active .menu__icon {
                            color: var(--reader-accent);
                        }

                        .menu__icon {
                            color: var(--reader-muted);
                            font-size: 20px;
                            width: 20px;
                            height: 20px;
                        }

                        .content {
                            background: var(--reader-bg);
                            padding: 24px;
                        }
                    `
                ],
                imports        : [
                    MatSidenavModule,
                    MatIconModule,
                    RouterModule,
                    NgForOf
                ]
            } )
export class SideMenuComponent {

    /**
     * Whether writer/editor tools are shown in the menu.
     * TODO (accounts phase): replace this always-true placeholder with the
     * signed-in user's role/permission check so plain readers don't see the Writer section.
     */
    readonly isEditor = true;

    readonly readerEntries: MenuEntry[] = [
        { title: 'Stories', routerLink: AppR.reader.stories.list.full, icon: IconEnum.Stories },
        { title: 'Collections', routerLink: AppR.reader.collections.list.full, icon: IconEnum.Collections }
    ];

    readonly writerEntries: MenuEntry[] = [
        { title: 'Stories', routerLink: AppR.writer.list.full, icon: IconEnum.Stories },
        { title: 'Collections', routerLink: AppR.writer.collections.list.full, icon: IconEnum.Collections },
        { title: 'Tags', routerLink: AppR.writer.tags.list.full, icon: IconEnum.Tag }
    ];

    readonly accountEntries: MenuEntry[] = [
        { title: 'Dashboard', routerLink: AppR.dashboard.full, icon: IconEnum.Dashboard },
        { title: 'Profile', routerLink: AppR.profile.full, icon: IconEnum.Profile },
        { title: 'Settings', routerLink: AppR.settings.full, icon: IconEnum.Settings }
    ];

    /**
     * TODO (accounts phase): wire to the real auth service — clear the session/token and
     * redirect to the login page. No auth exists yet, so this is a placeholder.
     */
    logout(): void {
        // intentionally empty until authentication is implemented
    }
}
