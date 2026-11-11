import { CdkOverlayOrigin, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface InfoPopupBadge {
    text: string;
    /** Colours both the text and the border; omit for the muted grey style. */
    color?: string;
    muted?: boolean;
}

export interface InfoPopupRow {
    label: string;
    value?: string;
    /** Rendered as chips instead of a single value. */
    chips?: string[];
    /** Renders the value in the muted italic "note" style. */
    note?: boolean;
}

/**
 * A styled card shown in a CDK connected overlay, anchored to a trigger element.
 * Shared chrome so every click-to-reveal popup (words, sentences, …) looks the same.
 */
@Component( {
                selector       : 'app-info-popup-card',
                standalone     : true,
                imports        : [
                    NgStyle,
                    OverlayModule
                ],
                template       : `
                    <ng-template
                        cdkConnectedOverlay
                        [cdkConnectedOverlayOrigin]="origin"
                        [cdkConnectedOverlayOpen]="open"
                        [cdkConnectedOverlayPositions]="positions"
                        [cdkConnectedOverlayHasBackdrop]="true"
                        cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
                        (backdropClick)="closed.emit()"
                        (overlayOutsideClick)="closed.emit()"
                        (detach)="closed.emit()">
                        <div class="info-card" [ngStyle]="{ 'width.px': width }">
                            <header class="info-card__header">
                                <div class="info-card__titles">
                                    <span
                                        class="info-card__title"
                                        [ngStyle]="{ 'color': titleColor || '#1f1f1f' }">
                                        {{ title }}
                                    </span>
                                    @if (subtitle) {
                                        <span class="info-card__subtitle">{{ subtitle }}</span>
                                    }
                                </div>
                                @if (badges.length) {
                                    <div class="info-card__badges">
                                        @for (badge of badges; track badge.text) {
                                            <span
                                                class="info-card__badge"
                                                [class.info-card__badge--muted]="badge.muted || !badge.color"
                                                [ngStyle]="badge.color && !badge.muted
                                                    ? { 'color': badge.color, 'border-color': badge.color }
                                                    : {}">
                                                {{ badge.text }}
                                            </span>
                                        }
                                    </div>
                                }
                            </header>

                            <section class="info-card__body">
                                @for (row of rows; track row.label) {
                                    @if (row.value || row.chips?.length) {
                                        <div class="info-card__row">
                                            <span class="info-card__label">{{ row.label }}</span>
                                            @if (row.chips?.length) {
                                                <span class="info-card__chips">
                                                    @for (chip of row.chips; track chip) {
                                                        <span class="info-card__chip">{{ chip }}</span>
                                                    }
                                                </span>
                                            } @else {
                                                <span
                                                    class="info-card__value"
                                                    [class.info-card__value--note]="row.note">
                                                    {{ row.value }}
                                                </span>
                                            }
                                        </div>
                                    }
                                }
                            </section>
                        </div>
                    </ng-template>
                `,
                styles         : [
                    `
                        .info-card {
                            max-width: 90vw;
                            background: #ffffff;
                            border: 1px solid #e0e0e0;
                            border-radius: 12px;
                            box-shadow: 0 8px 24px rgba( 0, 0, 0, 0.16 );
                            padding: 16px;
                            font-family: Roboto, "Helvetica Neue", sans-serif;
                            color: #1f1f1f;
                        }

                        .info-card__header {
                            display: flex;
                            align-items: flex-start;
                            justify-content: space-between;
                            gap: 12px;
                            padding-bottom: 12px;
                            margin-bottom: 12px;
                            border-bottom: 1px solid #efefef;
                        }

                        .info-card__titles {
                            display: flex;
                            flex-direction: column;
                            gap: 2px;
                            min-width: 0;
                        }

                        .info-card__title {
                            font-size: 22px;
                            font-weight: 600;
                            line-height: 1.3;
                            word-break: break-word;
                        }

                        .info-card__subtitle {
                            font-size: 14px;
                            color: #666;
                        }

                        .info-card__badges {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-end;
                            gap: 4px;
                            flex-shrink: 0;
                        }

                        .info-card__badge {
                            font-size: 11px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.4px;
                            padding: 2px 8px;
                            border: 1px solid currentColor;
                            border-radius: 999px;
                            white-space: nowrap;
                        }

                        .info-card__badge--muted {
                            color: #888;
                            border-color: #d0d0d0;
                        }

                        .info-card__body {
                            display: flex;
                            flex-direction: column;
                            gap: 10px;
                        }

                        .info-card__row {
                            display: grid;
                            grid-template-columns: 84px 1fr;
                            gap: 10px;
                            align-items: baseline;
                        }

                        .info-card__label {
                            font-size: 11px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.4px;
                            color: #9a9a9a;
                        }

                        .info-card__value {
                            font-size: 14px;
                            line-height: 1.4;
                            word-break: break-word;
                        }

                        .info-card__value--note {
                            color: #555;
                            font-style: italic;
                        }

                        .info-card__chips {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 6px;
                        }

                        .info-card__chip {
                            font-size: 13px;
                            padding: 2px 8px;
                            background: #f2f2f2;
                            border-radius: 6px;
                        }
                    `
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class InfoPopupCardComponent {
    @Input() origin!: CdkOverlayOrigin;
    @Input() open = false;
    @Input() width = 320;

    @Input() title = '';
    @Input() titleColor?: string;
    @Input() subtitle?: string;
    @Input() badges: InfoPopupBadge[] = [];
    @Input() rows: InfoPopupRow[] = [];

    @Output() closed = new EventEmitter<void>();

    // Prefer above the trigger, fall back to below when there is no room.
    readonly positions: ConnectedPosition[] = [
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 }
    ];
}
