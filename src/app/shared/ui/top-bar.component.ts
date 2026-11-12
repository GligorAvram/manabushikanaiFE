import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppR } from '@shared/config/constants/routes';

@Component( {
                standalone     : true,
                selector       : 'app-top-bar',
                template       : `
                    <header class="topbar">
                        <a class="brand" [routerLink]="dashboardLink" aria-label="Manabi home">
                            <span class="brand__jp">まなび</span>
                            <span class="brand__en">Manabi</span>
                        </a>
                    </header>
                `,
                styles         : [
                    `
                        .topbar {
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 56px;
                            display: flex;
                            align-items: center;
                            padding: 0 20px;
                            background: var(--reader-panel, #fff);
                            border-bottom: 1px solid var(--reader-line, #e7e3d8);
                            z-index: 3;
                        }

                        .brand {
                            display: inline-flex;
                            align-items: baseline;
                            gap: 9px;
                            text-decoration: none;
                            cursor: pointer;
                        }

                        .brand__jp {
                            font-family: var(--font-reading, serif);
                            font-weight: 700;
                            font-size: 22px;
                            color: var(--reader-accent, #38508c);
                        }

                        .brand__en {
                            font-family: var(--font-ui, sans-serif);
                            font-weight: 700;
                            font-size: 16px;
                            letter-spacing: .02em;
                            color: var(--reader-ink, #1c1b18);
                        }
                    `
                ],
                imports        : [ RouterModule ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class TopBarComponent {

    get dashboardLink(): string {
        return AppR.dashboard.full;
    }
}
