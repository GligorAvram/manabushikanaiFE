import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ParagraphDto } from '@models/Api';
import { OrderSentencesInParagraphPipe } from '@reader/pipes/order-sentences-in-paragraph.pipe';
import { SentenceBoxComponent } from '@reader/ui/sentence-box';

@Component( {
                selector       : 'app-sentence-display-component',
                standalone     : true,
                template       : `
                    <div class="reading-column" *ngIf="paragraphs; else noParagraph">
                        <p class="para" *ngFor="let paragraph of paragraphs">
                            <ng-container *ngIf="paragraph.sentences">
                                <app-sentence-box
                                    *ngFor="let sentence of paragraph.sentences | orderSentences"
                                    [sentence]="sentence"
                                ></app-sentence-box>
                            </ng-container>
                        </p>
                    </div>
                    <ng-template #noParagraph>
                        <div class="empty">Story could not be loaded</div>
                    </ng-template>
                `,
                styles         : [
                    `
                        /* White reading sheet, its own container. */
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
                ],
                imports        : [
                    CommonModule,
                    SentenceBoxComponent,
                    OrderSentencesInParagraphPipe
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class SentenceDisplayComponent {
    @Input() paragraphs!: ParagraphDto[] | undefined;
}
