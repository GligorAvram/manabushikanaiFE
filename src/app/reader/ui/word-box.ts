import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WordDto } from '@models/Api';
import { OverlayModule } from '@angular/cdk/overlay';
import { ACCENT_COLORS } from '@shared/config/constants/accent-colors';
import { DictionaryLanguageEnum } from '@shared/config/enums/dictionary-language.enum';
import { KanaTypesEnum } from '@shared/config/enums/kana-types.enum';
import { ShowAccent } from '@shared/config/enums/show-accent.enum';
import { InfoPopupBadge, InfoPopupCardComponent, InfoPopupRow } from '@shared/ui/info-popup-card.component';

@Component( {
                selector       : 'app-word-box',
                standalone     : true,
                imports        : [
                    NgStyle,
                    OverlayModule,
                    InfoPopupCardComponent
                ],
                template       : `
                    <span
                        cdkOverlayOrigin
                        #origin="cdkOverlayOrigin"
                        [ngStyle]="{
                            'background-color': (open || hovered) && isClickable ? 'lightgrey' : 'white',
                            'color': showAccent === ShowAccent.SHOW ? ACCENT_COLORS[word.translation.pitchAccent] : '#000000',
                            'cursor': isClickable ? 'pointer' : 'default'
                        }"
                        (click)="toggle()"
                        (mouseenter)="handleMouseOverSentence($event, true)"
                        (mouseleave)="handleMouseOverSentence($event, false)">
                        {{ getWordToDisplay(word) }}
                    </span>

                    <app-info-popup-card
                        [origin]="origin"
                        [open]="open"
                        [title]="word.translation.dictionaryForm"
                        [titleColor]="ACCENT_COLORS[word.translation.pitchAccent]"
                        [subtitle]="subtitle"
                        [badges]="badges"
                        [rows]="rows"
                        (closed)="close()">
                    </app-info-popup-card>
                `,
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class WordBoxComponent {
    @Input() word!: WordDto;
    @Input() kana!: string;
    @Input() showAccent!: ShowAccent;
    @Input() language: DictionaryLanguageEnum = DictionaryLanguageEnum.ENGLISH;

    hovered = false;
    open = false;

    protected readonly ACCENT_COLORS = ACCENT_COLORS;
    protected readonly ShowAccent = ShowAccent;

    get isClickable(): boolean {
        const english = this.word.translation.englishTranslation;
        return english !== 'PUNCTUATION' && english !== 'IGNORE';
    }

    get subtitle(): string | undefined {
        const { kana, dictionaryForm } = this.word.translation;
        return kana && kana !== dictionaryForm ? kana : undefined;
    }

    get badges(): InfoPopupBadge[] {
        const result: InfoPopupBadge[] = [];
        const { pitchAccent, isSetPhrase } = this.word.translation;
        if( pitchAccent && pitchAccent !== 'NONE' ) {
            result.push( { text: this.formatAccent( pitchAccent ), color: ACCENT_COLORS[pitchAccent] } );
        }
        if( isSetPhrase ) {
            result.push( { text: 'Set phrase', muted: true } );
        }
        return result;
    }

    get rows(): InfoPopupRow[] {
        const t = this.word.translation;
        const meaning: InfoPopupRow = this.language === DictionaryLanguageEnum.JAPANESE
            ? { label: '定義', value: t.japaneseDefinition }
            : { label: 'English', value: t.englishTranslation };
        return [
            meaning,
            { label: 'Also written', chips: t.alternativeWritings?.map( alt => alt.alternativeWriting ) },
            { label: 'Note', value: t.observation, note: true },
            { label: 'In context', value: this.word.observation, note: true }
        ];
    }

    handleMouseOverSentence($event: MouseEvent, hovered: boolean): void {
        $event.stopImmediatePropagation();
        this.hovered = hovered;
    }

    toggle(): void {
        if( this.isClickable ) {
            this.open = !this.open;
        }
    }

    close(): void {
        this.open = false;
    }

    formatAccent(accent: string): string {
        return accent.charAt( 0 ) + accent.slice( 1 ).toLowerCase();
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
