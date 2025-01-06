import { NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParagraphDto } from '@models/Api';
import { OrderWordsInParagraphPipe } from '@reader/pipes/order-words-in-paragraph.pipe';
import { WordBoxComponent } from '@reader/ui/word-box';
import { KanaTypesEnum } from '@shared/config/enums/kana-types.enum';
import { ShowAccent } from '@shared/config/enums/show-accent.enum';
import { ContainerComponent } from '@shared/ui/container.component';
import { RadioGroupComponent } from '@shared/ui/radio-group.component';
import { SliderComponent } from '@shared/ui/slider.component';

@Component( {
                selector  : 'app-word-display-component',
                standalone: true,
                imports   : [
                    ContainerComponent,
                    NgForOf,
                    NgIf,
                    WordBoxComponent,
                    OrderWordsInParagraphPipe,
                    FormsModule,
                    SliderComponent,
                    RadioGroupComponent
                ],
                template  : `
                    <app-container>
                        <app-radio-group
                            [options]="options"
                            (onSelectionChange)="selectDisplayedKana($event)"
                        >
                        </app-radio-group>
                        <app-slider
                            [rightOption]="showAccent"
                            [leftOption]="hideAccent"
                            (onChange)="setShowAccent($event)"
                        ></app-slider>

                        <app-container *ngIf="paragraphs; else noParagraph">
                            <div *ngFor="let paragraph of paragraphs">
                                <ng-container *ngIf="paragraph.words">
                                    <app-word-box
                                        *ngFor="let word of paragraph.words | orderWords"
                                        [word]="word"
                                        [kana]="displayedKana"
                                        [showAccent]="selected"
                                    ></app-word-box>
                                </ng-container>
                            </div>
                        </app-container>
                        <ng-template #noParagraph>
                            Story could not be loaded
                        </ng-template>
                    </app-container>
                `
            } )
export class WordDisplayComponent {
    @Input() paragraphs!: ParagraphDto[] | undefined;

    displayedKana: string = KanaTypesEnum.ORIGINAL;
    options: string[] = [ KanaTypesEnum.ORIGINAL, KanaTypesEnum.KANA_ONLY, KanaTypesEnum.KANJI_ONLY ];

    protected showAccent = ShowAccent.SHOW;
    protected hideAccent = ShowAccent.HIDE;
    selected: ShowAccent = this.hideAccent;

    setShowAccent($event: ShowAccent): void {
        this.selected = $event;
    }

    selectDisplayedKana(kana: string): void {
        this.displayedKana = kana;
    }
}
