import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Pill toggle switch (track + sliding thumb), the shared toggle style across the app.
 *
 * Two shapes, picked by the inputs you pass:
 *  - **two-option** — pass `leftOption`/`rightOption` (+ optional `leftLabel`/`rightLabel`);
 *    renders a label either side of the pill, the active side emphasised. `onChange` emits
 *    the selected option value (back-compat with the old Material slider).
 *  - **single on/off** — pass `label` (optionally changing with state); renders the pill
 *    followed by that one label. Read the boolean via `checkedChange`.
 */
@Component( {
                standalone     : true,
                selector       : 'app-slider',
                changeDetection: ChangeDetectionStrategy.OnPush,
                imports        : [ NgIf ],
                template       : `
                    <button type="button" class="toggle"
                            [class.toggle--on]="checked"
                            [class.toggle--disabled]="disabled"
                            [disabled]="disabled"
                            [attr.aria-pressed]="checked"
                            (click)="toggle()">
                        <span *ngIf="!label"
                              class="toggle__side"
                              [class.toggle__side--active]="!checked">{{ leftLabel ?? leftOption }}</span>

                        <span class="toggle__track"><span class="toggle__thumb"></span></span>

                        <span *ngIf="!label"
                              class="toggle__side"
                              [class.toggle__side--active]="checked">{{ rightLabel ?? rightOption }}</span>

                        <span *ngIf="label" class="toggle__label">{{ label }}</span>
                    </button>
                `,
                styles         : [
                    `
                        .toggle {
                            display: inline-flex;
                            align-items: center;
                            gap: 10px;
                            border: none;
                            background: transparent;
                            padding: 4px;
                            font-family: var(--font-ui);
                            font-size: 13px;
                            color: var(--reader-ink);
                            cursor: pointer;
                        }

                        .toggle--disabled {
                            cursor: not-allowed;
                            opacity: .55;
                        }

                        .toggle:focus-visible {
                            outline: 2px solid var(--reader-accent);
                            outline-offset: 2px;
                            border-radius: 6px;
                        }

                        .toggle__track {
                            flex: 0 0 auto;
                            width: 36px;
                            height: 20px;
                            border-radius: 999px;
                            background: #d9d4c7;
                            position: relative;
                            transition: background .15s ease;
                        }

                        .toggle--on .toggle__track {
                            background: var(--reader-accent);
                        }

                        .toggle__thumb {
                            position: absolute;
                            top: 2px;
                            left: 2px;
                            width: 16px;
                            height: 16px;
                            border-radius: 50%;
                            background: #fff;
                            transition: transform .15s ease;
                        }

                        .toggle--on .toggle__thumb {
                            transform: translateX(16px);
                        }

                        .toggle__side {
                            color: var(--reader-muted);
                            transition: color .15s ease;
                        }

                        .toggle__side--active {
                            color: var(--reader-ink);
                            font-weight: 600;
                        }

                        .toggle__label {
                            color: var(--reader-ink);
                        }
                    `
                ]
            } )
export class SliderComponent {
    @Input() disabled = false;
    @Input() checked = false;

    /** Values emitted by `onChange` for each side (back-compat API). */
    @Input() leftOption: any;
    @Input() rightOption: any;

    /** Optional display text; falls back to the option value when omitted. */
    @Input() leftLabel?: string;
    @Input() rightLabel?: string;

    /** Single on/off mode: show the pill + this one label instead of two sides. */
    @Input() label?: string;

    @Output() onChange = new EventEmitter<any>();
    @Output() checkedChange = new EventEmitter<boolean>();

    toggle(): void {
        if( this.disabled ) {
            return;
        }
        this.checked = !this.checked;
        this.checkedChange.emit( this.checked );
        this.onChange.emit( this.checked ? this.rightOption : this.leftOption );
    }
}
