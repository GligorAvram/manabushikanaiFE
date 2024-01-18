import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component( {
                selector       : 'app-settings-page',
                template       : `
                    <ng-container>
                        <div class="row mb-3">Settings</div>
                        <mat-divider></mat-divider>
                    </ng-container>
                `,
                providers      : [  ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class SettingsPageComponent {}