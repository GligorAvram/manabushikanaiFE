import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner.component';

@Component( {
                standalone     : true,
                selector       : 'app-container',
                template       : `
                    <div
                        class="container"
                        [style.height]="height ?? null"
                        [class.clickable]="clickable"
                        [class.container--panel]="!noBackground"
                        (click)="cardClicked()"
                    >
                        <div class="container__body">
                            <ng-container *ngIf="!loading; else loadingSpinner">
                                <div class="container__header">
                                    <ng-content select="[containerHeaderLeft]"></ng-content>
                                    <ng-content select="[containerHeaderRight]"></ng-content>
                                </div>
                                <ng-content></ng-content>
                            </ng-container>
                            <ng-template #loadingSpinner>
                                <div class="container__spinner">
                                    <app-loading-spinner [visible]="loading"></app-loading-spinner>
                                </div>
                            </ng-template>
                        </div>
                    </div>
                `,
                styles         : [
                    `
                        /* Neutral full-width wrapper. Kept visually faithful to the
                           original (white surface, no border/padding) so the shipped
                           reader pages that wrap their whole view in it are unchanged;
                           the dead Bootstrap utility classes it used before are dropped.
                           Writer framing comes from the bordered tables / local sections. */
                        .container {
                            display: flex;
                            flex-direction: column;
                            align-items: stretch;
                            width: 100%;
                            box-sizing: border-box;
                        }

                        .container--panel {
                            background: var(--reader-panel);
                        }

                        .container.clickable {
                            cursor: pointer;
                            transition: transform .2s ease;
                        }

                        .container.clickable:hover {
                            transform: scale(1.05);
                        }

                        .container__body {
                            width: 100%;
                        }

                        .container__header {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            width: 100%;
                        }

                        .container__header:empty {
                            display: none;
                        }

                        .container__spinner {
                            display: flex;
                            justify-content: center;
                            width: 100%;
                        }
                    `
                ],
                imports        : [ NgIf, LoadingSpinnerComponent ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class ContainerComponent {
    @Input()
    clickable = false;

    @Input()
    loading = false;

    @Input()
    height?: string;

    @Input()
    noBackground = false;

    @Output() onClick = new EventEmitter();

    cardClicked(): void {
        if( this.clickable ) {
            this.onClick.emit();
        }
    }
}
