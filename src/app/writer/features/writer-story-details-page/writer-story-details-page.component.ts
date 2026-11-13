import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { ModalService } from '@shared/features/modal/modal.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { CreateDictionaryWordFormModalData } from '@writer/config/writer.interfaces';
import { AddWordToDictionaryFormModalComponent } from '@writer/ui/add-word-to-dictionary-form-modal.component';
import { CreateDictionaryWordDto, CreateParagraphTranslationDto, CreateWordTranslationForParagraphDto, ParagraphDto } from 'app/models/Api';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { of } from 'rxjs';
import { WriterStoryDetailsDataService } from './writer-story-details-data.service';

@Component( {
                selector       : 'app-writer-story-details-page',
                standalone     : false,
                template       : `
                    <app-container *ngIf="dataService.data$ | async as data">
                        <app-loading-bar [visible]="data.loading"></app-loading-bar>

                        <app-header>
                            <app-title
                                headerLeft
                                title="Translate story"
                                subtitle="Add word- and sentence-level translations for each paragraph"
                                [icon]="icon.Stories"
                            ></app-title>
                            <div headerRight class="view-toggle">
                                <app-slider
                                    leftLabel="Word"
                                    rightLabel="Sentence"
                                    [leftOption]="wordView"
                                    [rightOption]="sentenceView"
                                    [checked]="selected === sentenceView"
                                    (onChange)="setSelected($event)"
                                ></app-slider>
                            </div>
                        </app-header>

                        <section class="editor-panel" *ngIf="data">
                            <div class="pager">
                                <mat-paginator [length]="data.paragraphs?.totalItems"
                                               [pageSize]="10"
                                               [pageSizeOptions]="[10]"
                                               (page)="handlePageEvent($event)"
                                               [hidePageSize]="true"
                                               aria-label="Select page">
                                </mat-paginator>
                            </div>

                            <mat-stepper [linear]="false" #stepper>
                                <mat-step *ngFor="let paragraph of data.paragraphs?.paragraphs" [stepControl]="firstFormGroup"
                                          [completed]="checkIfCompleted(paragraph)">

                                    <app-sentence-editor
                                        *ngIf="selected===sentenceView"
                                        [paragraph]="paragraph"
                                        (onTranslationSubmitted)="submitTranslationForParagraph($event)"
                                        (onProcessWithAiClicked)="generateSentenceTranslationWithAi($event)"
                                    ></app-sentence-editor>
                                    <app-word-editor
                                        *ngIf="selected===wordView"
                                        [paragraph]="paragraph"
                                        (onOnWordFieldFilled)="getTranslationForWord($event)"
                                        (onClearDictionaryWordsList)="clearWordTranslations()"
                                        [possibleTranslations]="data.possibleWordTranslations"
                                        (onWordTranslationSubmitted)="submitWordsTranslation($event)"
                                        (onProcessWithAiClicked)="generateWordTranslationWithAi($event)"
                                        (onOpenAddDictionaryModalClicked)="this.openAddWordToDictionaryFormModal()"
                                    ></app-word-editor>
                                </mat-step>
                            </mat-stepper>
                        </section>

                        <div class="action-bar">
                            <button type="button" class="publish-btn" (click)="publishStory()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                                Publish story
                            </button>
                        </div>
                    </app-container>
                `,
                styles         : [
                    `
                        /* Padding (not margin) so the action bar is included in the
                           sidenav-content scroll height and the Publish button is always
                           reachable at the bottom. */
                        :host {
                            display: block;
                            padding-bottom: 40px;
                        }

                        .view-toggle {
                            display: flex;
                            align-items: center;
                            padding: 4px 10px;
                            border: 1px solid var(--reader-line);
                            border-radius: 999px;
                            background: var(--reader-panel);
                        }

                        .editor-panel {
                            margin-top: 16px;
                            padding: 8px 20px 20px;
                            background: var(--reader-panel);
                            border: 1px solid var(--reader-line);
                            border-radius: var(--reader-radius);
                        }

                        .pager {
                            display: flex;
                            justify-content: flex-end;
                            border-bottom: 1px solid var(--reader-line-soft);
                        }

                        .action-bar {
                            display: flex;
                            justify-content: flex-end;
                            margin-top: 18px;
                        }

                        .publish-btn {
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            height: 42px;
                            padding: 0 20px;
                            border: none;
                            border-radius: 10px;
                            background: var(--reader-accent);
                            color: #fff;
                            font-family: var(--font-ui);
                            font-size: 14px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: background .12s ease;
                        }

                        .publish-btn:hover {
                            background: #2f4679;
                        }

                        .publish-btn:focus-visible {
                            outline: 2px solid var(--reader-accent);
                            outline-offset: 2px;
                        }

                        .publish-btn svg {
                            width: 17px;
                            height: 17px;
                        }
                    `
                ],
                providers      : [
                    WriterStoryDetailsDataService,
                    ModalService
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class WriterStoryDetailsPageComponent implements OnInit {

    firstFormGroup = this._formBuilder.group( {
                                                  firstCtrl: [ '' ]
                                              } );
    protected readonly icon = IconEnum;
    protected sentenceView = 'Sentence view';
    protected wordView = 'Word view';
    selected: string | undefined = this.wordView;

    constructor(
        public readonly dataService: WriterStoryDetailsDataService,
        public readonly modalService: ModalService,
        private readonly navigationService: NavigationService,
        private _formBuilder: FormBuilder
    ) {
    }

    setSelected(value: string | undefined) {
        this.selected = value;
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    submitTranslationForParagraph(paragraphTranslation: CreateParagraphTranslationDto) {
        this.dataService.submitTranslationForParagraph( paragraphTranslation );
    }

    generateSentenceTranslationWithAi(paragraphId: string) {
        this.dataService.generateSentenceTranslationWithAI( paragraphId );
    }

    generateWordTranslationWithAi(paragraphId: string) {
        this.dataService.generateWordTranslationWithAI( paragraphId );
    }

    getTranslationForWord(word: string) {
        this.dataService.getTranslationForWord( word );
    }

    clearWordTranslations() {
        this.dataService.clearPossibleDictionaryWordList();
    }

    submitWordsTranslation(data: CreateWordTranslationForParagraphDto) {
        this.dataService.submitWordTranslationToParagraph( data );
    }

    submitDictionaryWord(word: CreateDictionaryWordDto) {
        this.dataService.submitWordToDictionary( word );
        this.onWordAddedToDictionarySuccessfully();
    }

    onWordAddedToDictionarySuccessfully() {
        this.closeAddWordToDictionaryFormModal();
    }

    openAddWordToDictionaryFormModal() {
        this.modalService.openMdModal<CreateDictionaryWordFormModalData>(
            AddWordToDictionaryFormModalComponent,
            this,
            {
                loading$: of( false ),
                onSubmit: this.submitDictionaryWord.bind( this ),
                onCancel: this.closeAddWordToDictionaryFormModal.bind( this )
            }
        );
    }

    closeAddWordToDictionaryFormModal(): void {
        this.modalService.close( AddWordToDictionaryFormModalComponent );
    }

    handlePageEvent($event: PageEvent) {
        this.dataService.loadParagraphs( { pageSize: 10, pageNumber: $event.pageIndex } );
    }

    checkIfCompleted(paragraph: ParagraphDto) {
        if( this.selected === this.sentenceView ) {
            return paragraph.translationDone;
        }
        return paragraph.wordsDone;
    }

    publishStory() {
        this.dataService.publishStory()?.then( (result) => {
            if( result?.isSuccessful() ) {
                this.navigationService.writerStoryList();
            }
        } );
    }
}
