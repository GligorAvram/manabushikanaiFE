import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { SentenceDto } from '@models/Api';

@Component( {
                selector  : 'app-sentence-box',
                standalone: true,
                template  : `
                    <span
                        [ngStyle]="hovered ? hoveredStyle : defaultStyle"
                        (click)="tooltip.toggle()"
                        #tooltip="matTooltip"
                        (mouseenter)="handleMouseOverSentence($event, true)"
                        (mouseleave)="handleMouseOverSentence($event, false)"
                        matTooltip="{{sentence.englishTranslation}}"
                        matTooltipPosition="above">
                        {{ sentence.japaneseSentence }}
                    </span>
                `,
                styles    : [],
                imports   : [
                    MatTooltip,
                    NgStyle
                ]
            } )
export class SentenceBoxComponent {
    @Input() sentence!: SentenceDto;

    hovered = false;

    defaultStyle = { 'background-color': 'white' };
    hoveredStyle = { 'background-color': 'lightgrey' };

    handleMouseOverSentence($event: MouseEvent, hovered: boolean): void {
        $event.stopImmediatePropagation();
        this.hovered = hovered;
    }
}
