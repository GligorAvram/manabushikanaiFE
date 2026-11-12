import { NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ParagraphDto, PitchAccentEnum } from '@models/Api';
import { OrderWordsInParagraphPipe } from '@reader/pipes/order-words-in-paragraph.pipe';
import { WordBoxComponent } from '@reader/ui/word-box';
import { SliderComponent } from '@shared/ui/slider.component';
import { ACCENT_COLORS } from '@shared/config/constants/accent-colors';
import { DictionaryLanguageEnum } from '@shared/config/enums/dictionary-language.enum';
import { KanaTypesEnum } from '@shared/config/enums/kana-types.enum';
import { ShowAccent } from '@shared/config/enums/show-accent.enum';

@Component( {
                selector  : 'app-word-display-component',
                standalone: true,
                imports   : [
                    NgForOf,
                    NgIf,
                    WordBoxComponent,
                    OrderWordsInParagraphPipe,
                    SliderComponent
                ],
                template  : `
                    <div class="word-display">
                        <div class="word-toolbar">
                            <div class="toolbar__group">
                                <span class="toolbar__label">Display</span>
                                <div class="seg" role="group" aria-label="Display mode">
                                    <button type="button" class="seg__btn"
                                            *ngFor="let opt of displayOptions"
                                            [class.seg__btn--active]="displayedKana === opt.value"
                                            [attr.aria-pressed]="displayedKana === opt.value"
                                            (click)="selectDisplayedKana(opt.value)">{{ opt.label }}</button>
                                </div>
                            </div>

                            <div class="toolbar__group">
                                <span class="toolbar__label">Meaning</span>
                                <app-slider
                                    [label]="language === DictionaryLanguageEnum.JAPANESE ? '日本語' : 'English'"
                                    [checked]="language === DictionaryLanguageEnum.JAPANESE"
                                    (checkedChange)="setLanguage($event)">
                                </app-slider>
                            </div>

                            <app-slider
                                [label]="accentShown ? 'Show pitch accent' : 'Hide pitch accent'"
                                [checked]="accentShown"
                                (checkedChange)="setAccent($event)">
                            </app-slider>

                            <div class="legend">
                                <span class="legend__title">Pitch accent colors</span>
                                <div class="legend__items">
                                    <span class="legend__item" *ngFor="let item of accentLegend">
                                        <span class="legend__dot" [style.background-color]="item.color"></span>{{ language === DictionaryLanguageEnum.ENGLISH ? item.en : item.jp }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="reading-column" *ngIf="paragraphs; else noParagraph">
                            <p class="para" *ngFor="let paragraph of paragraphs">
                                <ng-container *ngIf="paragraph.words">
                                    <app-word-box
                                        *ngFor="let word of paragraph.words | orderWords"
                                        [word]="word"
                                        [kana]="displayedKana"
                                        [showAccent]="selected"
                                        [language]="language"
                                    ></app-word-box>
                                </ng-container>
                            </p>
                        </div>
                        <ng-template #noParagraph>
                            <div class="empty">Story could not be loaded</div>
                        </ng-template>
                    </div>
                `,
                styles    : [
                    `
                        .word-toolbar {
                            display: flex;
                            flex-wrap: wrap;
                            align-items: center;
                            gap: 20px;
                            max-width: 820px;
                            margin: 0 auto 28px;
                            padding: 12px 16px;
                            background: var(--reader-panel);
                            border: 1px solid var(--reader-line);
                            border-radius: 12px;
                            font-family: var(--font-ui);
                        }

                        .toolbar__group {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        }

                        .toolbar__label {
                            font-size: 12px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: .04em;
                            color: var(--reader-muted);
                        }

                        /* segmented: Original / Kana / Kanji */
                        .seg {
                            display: flex;
                            border: 1px solid var(--reader-line);
                            border-radius: 8px;
                            overflow: hidden;
                        }

                        .seg__btn {
                            border: none;
                            border-left: 1px solid var(--reader-line);
                            background: var(--reader-panel);
                            padding: 6px 14px;
                            font-family: var(--font-ui);
                            font-size: 13px;
                            color: var(--reader-ink-soft);
                            cursor: pointer;
                        }

                        .seg__btn:first-child {
                            border-left: none;
                        }

                        .seg__btn--active {
                            background: var(--reader-accent);
                            color: #fff;
                            font-weight: 600;
                        }

                        .seg__btn:focus-visible {
                            outline: 2px solid var(--reader-accent);
                            outline-offset: 2px;
                        }

                        .legend {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-end;
                            gap: 4px;
                            margin-left: auto;
                            font-size: 12px;
                            color: var(--reader-ink-soft);
                        }

                        .legend__title {
                            font-size: 11px;
                            text-transform: uppercase;
                            letter-spacing: .04em;
                            color: var(--reader-muted);
                            opacity: .75;
                        }

                        .legend__items {
                            display: flex;
                            flex-wrap: wrap;
                            align-items: center;
                            justify-content: flex-end;
                            gap: 14px;
                        }

                        .legend__item {
                            display: inline-flex;
                            align-items: center;
                            gap: 5px;
                            font-family: var(--font-jp);
                        }

                        .legend__dot {
                            width: 10px;
                            height: 10px;
                            border-radius: 3px;
                        }

                        /* White reading sheet — its own container, separate from
                           the options toolbar above it. */
                        .reading-column {
                            max-width: 820px;
                            margin: 0 auto;
                            padding: 44px 40px;
                            background: var(--reader-panel);
                            border: 1px solid var(--reader-line);
                            border-radius: var(--reader-radius);
                            box-shadow: 0 1px 2px rgba(0, 0, 0, .04);
                            font-family: var(--font-reading);
                            font-size: 28px;
                            line-height: 2.4;
                            color: var(--reader-ink);
                        }

                        .para {
                            margin: 0 0 28px;
                        }

                        .para:last-child {
                            margin-bottom: 0;
                        }

                        .empty {
                            max-width: 820px;
                            margin: 0 auto;
                            color: var(--reader-muted);
                            font-family: var(--font-ui);
                        }

                        @media (max-width: 600px) {
                            .reading-column {
                                padding: 28px 20px;
                            }
                        }
                    `
                ]
            } )
export class WordDisplayComponent {
    @Input() paragraphs!: ParagraphDto[] | undefined;

    displayedKana: string = KanaTypesEnum.ORIGINAL;
    readonly displayOptions: { value: string; label: string }[] = [
        { value: KanaTypesEnum.ORIGINAL, label: 'Original' },
        { value: KanaTypesEnum.KANA_ONLY, label: 'Kana' },
        { value: KanaTypesEnum.KANJI_ONLY, label: 'Kanji' }
    ];

    language: DictionaryLanguageEnum = DictionaryLanguageEnum.ENGLISH;
    readonly DictionaryLanguageEnum = DictionaryLanguageEnum;

    selected: ShowAccent = ShowAccent.HIDE;

    readonly accentLegend = [
        { jp: '平板', en: 'Heiban', color: ACCENT_COLORS[PitchAccentEnum.HEIBAN] },
        { jp: '頭高', en: 'Atamadaka', color: ACCENT_COLORS[PitchAccentEnum.ATAMADAKA] },
        { jp: '中高', en: 'Nakadaka', color: ACCENT_COLORS[PitchAccentEnum.NAKADAKA2] },
        { jp: '尾高', en: 'Odaka', color: ACCENT_COLORS[PitchAccentEnum.OODAKA] }
    ];

    get accentShown(): boolean {
        return this.selected === ShowAccent.SHOW;
    }

    setAccent(show: boolean): void {
        this.selected = show ? ShowAccent.SHOW : ShowAccent.HIDE;
    }

    selectDisplayedKana(kana: string): void {
        this.displayedKana = kana;
    }

    setLanguage(japanese: boolean): void {
        this.language = japanese ? DictionaryLanguageEnum.JAPANESE : DictionaryLanguageEnum.ENGLISH;
    }
}
