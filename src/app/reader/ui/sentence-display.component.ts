import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ParagraphDto } from '@models/Api';
import { OrderSentencesInParagraphPipe } from '@reader/pipes/order-sentences-in-paragraph.pipe';
import { SentenceBoxComponent } from '@reader/ui/sentence-box';
import { ContainerComponent } from '@shared/ui/container.component';

@Component( {
                selector       : 'app-sentence-display-component',
                standalone     : true,
                template       : `
                    <app-container>
                        <app-container *ngIf="paragraphs; else noParagraph">
                            <div *ngFor="let paragraph of paragraphs">
                                <ng-container *ngIf="paragraph.sentences">
                                    <app-sentence-box
                                        *ngFor="let sentence of paragraph.sentences | orderSentences"
                                        [sentence]="sentence"
                                    ></app-sentence-box>
                                </ng-container>
                            </div>
                        </app-container>
                        <ng-template #noParagraph>
                            Story could not be loaded
                        </ng-template>
                    </app-container>
                `,
                imports        : [
                    ContainerComponent,
                    CommonModule,
                    SentenceBoxComponent,
                    OrderSentencesInParagraphPipe
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class SentenceDisplayComponent {
    @Input() paragraphs!: ParagraphDto[] | undefined;
}
