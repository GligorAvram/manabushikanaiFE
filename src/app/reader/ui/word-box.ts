import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { WordDto } from '@models/Api';
import { ACCENT_COLORS } from '@shared/config/constants/accent-colors';
import { KanaTypesEnum } from '@shared/config/enums/kana-types.enum';
import { ShowAccent } from '@shared/config/enums/show-accent.enum';

@Component( {
                selector       : 'app-word-box',
                standalone     : true,
                imports        : [
                    MatTooltip,
                    NgStyle
                ],
                template       : `
                    <span
                        [ngStyle]="{
                            'background-color': hovered && (word.translation.englishTranslation !== 'PUNCTUATION' && word.translation.englishTranslation !== 'IGNORE') ? 'lightgrey' : 'white',
                            'color': showAccent === ShowAccent.SHOW ? ACCENT_COLORS[word.translation.pitchAccent] : '#000000'
                        }"
                        (click)="wordTooltip.toggle()"
                        #wordTooltip="matTooltip"
                        (mouseenter)="handleMouseOverSentence($event, true)"
                        (mouseleave)="handleMouseOverSentence($event, false)"
                        [matTooltipDisabled]="word.translation.englishTranslation === 'PUNCTUATION' || word.translation.englishTranslation === 'IGNORE'"
                        matTooltip="{{word.translation.dictionaryForm}}({{word.translation.kana}}) : {{word.translation.englishTranslation}}"
                        matTooltipPosition="above">
                        {{ getWordToDisplay(word) }}
                    </span>
                `,
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class WordBoxComponent implements OnInit {
    @Input() word!: WordDto;
    @Input() kana!: string;
    @Input() showAccent!: ShowAccent;

    hovered = false;
    protected readonly ACCENT_COLORS = ACCENT_COLORS;
    protected readonly ShowAccent = ShowAccent;

    handleMouseOverSentence($event: MouseEvent, hovered: boolean): void {
        $event.stopImmediatePropagation();
        this.hovered = hovered;
    }

    ngOnInit(): void {
    }

    getWordToDisplay(word: WordDto): string {
        if( this.kana == KanaTypesEnum.ORIGINAL ) {
            return word.originalWord;
        } else if( this.kana === KanaTypesEnum.KANJI_ONLY && word.wordKanji ) {
            return word.wordKanji;
        }
        return word.wordKana;
    }
}
