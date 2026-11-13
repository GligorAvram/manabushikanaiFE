import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { ButtonModule } from '@shared/ui/buttons/button.module';
import { DeleteButtonComponent } from '@shared/ui/buttons/delete-button.component';
import { InputModule } from '@shared/ui/input/input.module';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { CreateSentenceDto, ParagraphDto } from 'app/models/Api';

@Component( {
                selector       : 'app-sentence-editor',
                template       : `
                    <div class="seditor" *ngIf="paragraph">
                        <div class="seditor__toolbar">
                            <span class="seditor__step-label">Sentence translations</span>
                            <button type="button" class="ai-btn" (click)="processWithAi()">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/></svg>
                                Process with AI
                            </button>
                        </div>

                        <div class="source-card">
                            <span class="source-card__hint">Select text in the paragraph to add it as a segment.</span>
                            <div
                                [innerHTML]="displayText"
                                (mouseup)="addSentence($event)"
                                class="text-container"
                            ></div>
                        </div>

                        <div class="seditor__grid">
                            <div class="segments">
                                <h4 class="segments__heading">Segments</h4>
                                <p class="segments__empty" *ngIf="!sentences.length">
                                    No segments yet — select text above to begin.
                                </p>
                                <div
                                    cdkDropList
                                    [cdkDropListData]="sentences"
                                    class="segments__list"
                                    (cdkDropListDropped)="drop($event)">
                                    <div class="segment"
                                         *ngFor="let item of sentences; let i = index"
                                         [class.segment--active]="selectedIndex === i"
                                         cdkDrag>
                                        <span class="segment__handle" cdkDragHandle aria-hidden="true">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01"/></svg>
                                        </span>
                                        <button type="button" class="segment__text" (click)="setAsSelectedSentence(item, i)">
                                            {{ item.japaneseSentence }}
                                        </button>
                                        <app-delete-button
                                            appButton
                                            (click)="removeSentence(i)"
                                        ></app-delete-button>
                                    </div>
                                </div>
                            </div>

                            <div class="edit">
                                <h4 class="edit__heading">Edit segment</h4>
                                <form [formGroup]="form" (ngSubmit)="editSentence()">
                                    <app-text-input
                                        class="displayBlock"
                                        appInput
                                        label="Original sentence"
                                        [control]="form.controls.orig"
                                    ></app-text-input>
                                    <app-text-input
                                        class="displayBlock"
                                        appInput
                                        label="Translation"
                                        [control]="form.controls.translation"
                                        formControlName="translation"
                                    ></app-text-input>
                                    <button type="submit" class="btn btn--ghost">Save segment</button>
                                </form>
                            </div>
                        </div>

                        <div class="seditor__footer">
                            <button type="button" class="btn btn--primary" (click)="submitTranslation()">
                                Save paragraph translation
                            </button>
                        </div>
                    </div>
                `,
                standalone     : true,
                styles         : [
                    `
                        .seditor {
                            display: flex;
                            flex-direction: column;
                            gap: 18px;
                            font-family: var(--font-ui);
                            padding: 20px 0 4px;
                        }

                        .seditor__toolbar {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            gap: 12px;
                        }

                        .seditor__step-label {
                            font-size: 13px;
                            font-weight: 600;
                            letter-spacing: .03em;
                            text-transform: uppercase;
                            color: var(--reader-muted);
                        }

                        .source-card {
                            display: flex;
                            flex-direction: column;
                            gap: 10px;
                            padding: 16px 18px;
                            background: var(--reader-bg);
                            border: 1px solid var(--reader-line);
                            border-radius: 12px;
                        }

                        .source-card__hint {
                            font-size: 12px;
                            color: var(--reader-muted);
                        }

                        .text-container {
                            cursor: text;
                            user-select: text;
                            font-family: var(--font-jp);
                            font-size: 18px;
                            line-height: 1.9;
                            color: var(--reader-ink);
                        }

                        .grayed-out {
                            color: var(--reader-muted);
                            pointer-events: none;
                        }

                        .seditor__grid {
                            display: grid;
                            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                            gap: 18px;
                            align-items: start;
                        }

                        @media (max-width: 860px) {
                            .seditor__grid {
                                grid-template-columns: minmax(0, 1fr);
                            }
                        }

                        .segments,
                        .edit {
                            padding: 16px;
                            background: var(--reader-panel);
                            border: 1px solid var(--reader-line);
                            border-radius: 12px;
                        }

                        .segments__heading,
                        .edit__heading {
                            margin: 0 0 12px;
                            font-size: 12px;
                            font-weight: 600;
                            letter-spacing: .03em;
                            text-transform: uppercase;
                            color: var(--reader-muted);
                        }

                        .segments__empty {
                            margin: 0;
                            font-size: 13px;
                            color: var(--reader-muted);
                        }

                        .segments__list {
                            display: flex;
                            flex-direction: column;
                            gap: 8px;
                        }

                        .segment {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            padding: 6px 8px;
                            border: 1px solid var(--reader-line);
                            border-radius: 10px;
                            background: var(--reader-bg);
                        }

                        .segment--active {
                            border-color: var(--reader-accent);
                            box-shadow: 0 0 0 2px var(--reader-accent-soft);
                        }

                        .segment__handle {
                            display: inline-flex;
                            flex: 0 0 auto;
                            cursor: move;
                            color: var(--reader-muted);
                        }

                        .segment__handle svg {
                            width: 16px;
                            height: 16px;
                        }

                        .segment__text {
                            flex: 1 1 auto;
                            min-width: 0;
                            text-align: left;
                            border: none;
                            background: transparent;
                            cursor: pointer;
                            font-family: var(--font-jp);
                            font-size: 15px;
                            color: var(--reader-ink);
                        }

                        .displayBlock {
                            display: block;
                            width: 100%;
                        }

                        .seditor__footer {
                            display: flex;
                            justify-content: flex-end;
                        }

                        .btn {
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            height: 40px;
                            padding: 0 18px;
                            border-radius: 10px;
                            font-family: var(--font-ui);
                            font-size: 14px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: background .12s ease, border-color .12s ease;
                        }

                        .btn--primary {
                            border: none;
                            background: var(--reader-accent);
                            color: #fff;
                        }

                        .btn--primary:hover {
                            background: #2f4679;
                        }

                        .btn--ghost {
                            border: 1px solid var(--reader-line);
                            background: var(--reader-panel);
                            color: var(--reader-ink);
                        }

                        .btn--ghost:hover {
                            border-color: var(--reader-accent);
                            color: var(--reader-accent);
                        }

                        .ai-btn {
                            display: inline-flex;
                            align-items: center;
                            gap: 7px;
                            height: 36px;
                            padding: 0 14px;
                            border: 1px solid var(--reader-line);
                            border-radius: 9px;
                            background: var(--reader-panel);
                            color: var(--reader-accent);
                            font-family: var(--font-ui);
                            font-size: 13px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: border-color .12s ease, background .12s ease;
                        }

                        .ai-btn:hover {
                            border-color: var(--reader-accent);
                            background: var(--reader-accent-soft);
                        }

                        .ai-btn svg {
                            width: 16px;
                            height: 16px;
                        }
                    `
                ],
                encapsulation  : ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                imports        : [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    DragDropModule,
                    InputModule,
                    ButtonModule,
                    DeleteButtonComponent,
                    TextInputComponent
                ]
            } )
export class SentenceEditorComponent implements OnInit {
    @Input()
    paragraph!: ParagraphDto;

    @Output()
    onTranslationSubmitted: EventEmitter<{ sentences: CreateSentenceDto[], id: string }> = new EventEmitter();

    @Output()
    onProcessWithAiClicked: EventEmitter<string> = new EventEmitter();

    displayText!: SafeHtml;
    sentences: CreateSentenceDto[] = [];
    selectedSentence: CreateSentenceDto | null = null;
    selectedIndex: number | null = null;

    form!: FormGroup<{ orig: FormControl<string>, translation: FormControl<string> }>;
    protected readonly icon = IconEnum;

    constructor(private sanitizer: DomSanitizer,
                private _formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.sentences = this.paragraph.sentences
                         ? this.paragraph.sentences.map( sentence => (
                                   {
                                       japaneseSentence  : sentence.japaneseSentence,
                                       englishTranslation: sentence.englishTranslation,
                                       order             : sentence.order
                                   }
                               ) )
                               .sort( (s1, s2) => s1.order - s2.order )
                         : [];
        this.displayText = this.sanitizeText( this.paragraph.originalParagraph );
        this.createFormBuilder();
    }

    createFormBuilder() {
        this.form = this._formBuilder.nonNullable.group( {
                                                             orig       : '',
                                                             translation: ''
                                                         } );
    }

    processWithAi() {
        this.onProcessWithAiClicked.emit( this.paragraph.id );
    }

    submitTranslation() {
        this.onTranslationSubmitted.emit( {
                                              sentences: this.sentences.map( (e, index) => {
                                                  return {
                                                      japaneseSentence  : e.japaneseSentence,
                                                      englishTranslation: e.englishTranslation!,
                                                      order             : index
                                                  };
                                              } ),
                                              id       : this.paragraph.id
                                          } );
    }

    addSentence(event: MouseEvent) {
        const selection = window.getSelection();
        if( !selection ) {
            return;
        }

        const japaneseSentence = selection.toString()
                                          .trim();
        if( japaneseSentence ) {
            const sentence = { japaneseSentence } as CreateSentenceDto;
            this.sentences.push( sentence );
            this.updateTextWithAllHighlights();
            selection.removeAllRanges();
            this.setAsSelectedSentence( sentence, this.sentences.length - 1 );
        }
    }

    updateTextWithAllHighlights(): void {
        let updatedText = this.paragraph.originalParagraph;
        let lastIndex = 0; // Track the last matched index for sequential validation

        this.sentences.forEach( (text) => {
            const regex = new RegExp( `(${ this.escapeRegExp( text.japaneseSentence ) })`, 'g' );
            const match = updatedText.match( regex );

            if( match ) {
                const index = updatedText.indexOf( text.japaneseSentence );

                if( index >= lastIndex ) {
                    // Only gray-out texts that are sequential
                    updatedText = updatedText.replace(
                        regex,
                        '<span class="grayed-out">$1</span>'
                    );
                    lastIndex = index + text.japaneseSentence.length; // Update the last matched index
                }
            }
        } );

        this.displayText = this.sanitizeText( updatedText );
    }

    removeSentence(index: number): void {
        this.sentences.splice( index, 1 );
        // Reuse the shared highlighter (no ad-hoc regex, consistent with add/drop).
        this.updateTextWithAllHighlights();

        // Keep the edit box in sync with what was removed.
        if( this.selectedIndex === index ) {
            // The selected sentence itself was deleted — clear the edit box.
            this.deselectSentence();
        } else if( this.selectedIndex !== null && index < this.selectedIndex ) {
            // A sentence before the selected one was removed — the selection shifted down by one.
            this.selectedIndex--;
            this.selectedSentence = this.sentences[this.selectedIndex] ?? null;
        }
    }

    /** Escapes regex metacharacters so arbitrary sentence text is safe inside `new RegExp`. */
    private escapeRegExp(value: string): string {
        return value.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );
    }

    sanitizeText(text: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml( text );
    }

    drop(event: CdkDragDrop<CreateSentenceDto[]>): void {
        moveItemInArray( this.sentences, event.previousIndex, event.currentIndex );
        this.updateTextWithAllHighlights();
        this.setAsSelectedSentence( this.sentences[event.currentIndex], event.currentIndex );
    }

    setAsSelectedSentence(sentence: CreateSentenceDto, index: number) {
        this.selectedSentence = sentence;
        this.selectedIndex = index;
        this.form.controls.orig.setValue( sentence.japaneseSentence );
        this.form.controls.translation.setValue( sentence.englishTranslation ?? '' );
    }

    /** Clears the selection and resets the edit box. */
    deselectSentence(): void {
        this.selectedSentence = null;
        this.selectedIndex = null;
        this.form.controls.orig.setValue( '' );
        this.form.controls.translation.setValue( '' );
    }

    editSentence() {
        if( this.selectedIndex !== null ) {
            this.sentences[this.selectedIndex].japaneseSentence = this.form.controls.orig.getRawValue();
            this.sentences[this.selectedIndex].englishTranslation = this.form.controls.translation.getRawValue();
        }

        this.selectedIndex = null;
        this.selectedSentence = null;
    }
}
