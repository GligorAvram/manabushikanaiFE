import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component( {
                selector       : 'app-dashboard-page',
                standalone     : false,
                template       : `
                    <ng-container>
                        <div class="row mb-3">Dashboard</div>
                        <mat-divider></mat-divider>
                    </ng-container>
                `,
                providers      : [],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class DashboardPageComponent {

}
