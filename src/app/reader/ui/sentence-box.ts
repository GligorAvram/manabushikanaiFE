import { NgStyle } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SentenceDto } from '@models/Api';
import { InfoPopupRow, InfoPopupCardComponent } from '@shared/ui/info-popup-card.component';

@Component( {
                selector       : 'app-sentence-box',
                standalone     : true,
                template       : `
                    <span
                        cdkOverlayOrigin
                        #origin="cdkOverlayOrigin"
                        [ngStyle]="{
                            'background-color': open || hovered ? 'lightgrey' : 'white',
                            'cursor': 'pointer'
                        }"
                        (click)="toggle()"
                        (mouseenter)="handleMouseOverSentence($event, true)"
                        (mouseleave)="handleMouseOverSentence($event, false)">
                        {{ sentence.japaneseSentence }}
                    </span>

                    <app-info-popup-card
                        [origin]="origin"
                        [open]="open"
                        [width]="380"
                        [title]="sentence.japaneseSentence"
                        [rows]="rows"
                        (closed)="close()">
                    </app-info-popup-card>
                `,
                imports        : [
                    NgStyle,
                    OverlayModule,
                    InfoPopupCardComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class SentenceBoxComponent {
    @Input() sentence!: SentenceDto;

    hovered = false;
    open = false;

    get rows(): InfoPopupRow[] {
        return [
            { label: 'English', value: this.sentence.englishTranslation }
        ];
    }

    handleMouseOverSentence($event: MouseEvent, hovered: boolean): void {
        $event.stopImmediatePropagation();
        this.hovered = hovered;
    }

    toggle(): void {
        this.open = !this.open;
    }

    close(): void {
        this.open = false;
    }
}
