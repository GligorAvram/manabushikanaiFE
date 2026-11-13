import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconEnum } from '@shared/config/enums/icon.enum';
import { ButtonModule } from '@shared/ui/buttons/button.module';
import { DeleteButtonComponent } from '@shared/ui/buttons/delete-button.component';
import { InputModule } from '@shared/ui/input/input.module';
import { SearchDropdownInputComponent } from '@shared/ui/input/search-dropdown-input.component';
import { TextInputComponent } from '@shared/ui/input/text-input.component';
import { WriterPipesModule } from '@writer/pipes/writer-pipes.module';
import { CreateWordTranslationDto, CreateWordTranslationForParagraphDto, DictionaryWordDto, ParagraphDto } from 'app/models/Api';

/**
 * In-editor word row. Besides the fields we submit, it keeps the full
 * {@link DictionaryWordDto} that was chosen so the translation dropdown can
 * re-display it when the user switches back to this word.
 */
type EditableWordTranslation = CreateWordTranslationDto & { dictionaryWord?: DictionaryWordDto };

@Component( {
                selector       : 'app-word-editor',
                template       : `
                    <div class="weditor" *ngIf="paragraph">
                        <div class="weditor__toolbar">
                            <span class="weditor__step-label">Word translations</span>
                            <div class="weditor__tools">
                                <button type="button" class="ai-btn" (click)="processWithAi()">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/></svg>
                                    Process with AI
                                </button>
                                <button type="button" class="ai-btn" (click)="openAddWordToDictionaryFormModal()">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                                    Add word to dictionary
                                </button>
                            </div>
                        </div>

                        <div class="source-card">
                            <span class="source-card__hint">Select text in the paragraph to add it as a word.</span>
                            <div
                                [innerHTML]="displayText"
                                (mouseup)="addWord($event)"
                                class="text-container"
                            ></div>
                        </div>

                        <div class="weditor__grid">
                            <div class="words">
                                <h4 class="words__heading">Words</h4>
                                <p class="words__empty" *ngIf="!translatedParagraph.length">
                                    No words yet — select text above to begin.
                                </p>
                                <div
                                    cdkDropList
                                    [cdkDropListData]="translatedParagraph"
                                    cdkDropListOrientation="mixed"
                                    class="words__list"
                                    (cdkDropListDropped)="drop($event)">
                                    <span class="word"
                                          *ngFor="let item of translatedParagraph; let i = index"
                                          [class.word--missing]="!item.dictionaryWordId || !item.wordKana"
                                          [class.word--active]="selectedIndex === i"
                                          cdkDrag>
                                        <button type="button" class="word__text" (click)="setAsSelectedWord(item, i)">
                                            {{ item.originalWord }}
                                        </button>
                                        <app-delete-button
                                            appButton
                                            class="no-touch-target"
                                            (click)="removeWord(i)"
                                        ></app-delete-button>
                                    </span>
                                </div>
                            </div>

                            <div class="edit">
                                <h4 class="edit__heading">Edit word</h4>
                                <form *ngIf="form" [formGroup]="form" (ngSubmit)="editWord()">
                                    <app-text-input
                                        class="displayBlock"
                                        appInput
                                        label="Original word"
                                        [control]="form.controls.originalWord"
                                        formControlName="originalWord"
                                    ></app-text-input>
                                    <app-search-dropdown-input class="displayBlock"
                                                               appInput
                                                               formControlName="dictionaryWordId"
                                                               (search)="handleGetWordTranslation($event)"
                                                               (optionSelected)="onTranslationSelected($event)"
                                                               (textChange)="onTranslationTextChange($event)"
                                                               (clearOptionsList)="clearDictionaryWordList()"
                                                               [label]="'Search for translation'"
                                                               [placeholder]="'Search for a translation...'"
                                                               [control]="form.controls.dictionaryWordId"
                                                               [searchResults]="possibleTranslations"
                                                               [displayFn]="displayDictionaryWord"
                                                               [revertOnBlur]="true"/>
                                    <app-text-input
                                        class="displayBlock"
                                        appInput
                                        label="Kanji"
                                        [control]="form.controls.wordKanji"
                                        formControlName="wordKanji"
                                    ></app-text-input>
                                    <app-text-input
                                        class="displayBlock"
                                        appInput
                                        label="Kana"
                                        [control]="form.controls.wordKana"
                                        formControlName="wordKana"
                                    ></app-text-input>
                                    <app-text-input
                                        class="displayBlock"
                                        appInput
                                        label="Observation"
                                        [control]="form.controls.observation"
                                        formControlName="observation"
                                    ></app-text-input>
                                    <button type="submit" class="btn btn--ghost" [disabled]="!form.valid">Save word</button>
                                </form>
                            </div>
                        </div>

                        <div class="weditor__footer">
                            <button type="button" class="btn btn--primary" (click)="submitTranslation()">
                                Save paragraph translation
                            </button>
                        </div>
                    </div>
                `,
                standalone     : true,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles         : [
                    `
                        .weditor {
                            display: flex;
                            flex-direction: column;
                            gap: 18px;
                            font-family: var(--font-ui);
                            padding: 20px 0 4px;
                        }

                        .weditor__toolbar {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            gap: 12px;
                            flex-wrap: wrap;
                        }

                        .weditor__tools {
                            display: flex;
                            gap: 8px;
                            flex-wrap: wrap;
                        }

                        .weditor__step-label {
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

                        .weditor__grid {
                            display: grid;
                            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                            gap: 18px;
                            align-items: start;
                        }

                        @media (max-width: 860px) {
                            .weditor__grid {
                                grid-template-columns: minmax(0, 1fr);
                            }
                        }

                        .words,
                        .edit {
                            padding: 16px;
                            background: var(--reader-panel);
                            border: 1px solid var(--reader-line);
                            border-radius: 12px;
                        }

                        .words__heading,
                        .edit__heading {
                            margin: 0 0 12px;
                            font-size: 12px;
                            font-weight: 600;
                            letter-spacing: .03em;
                            text-transform: uppercase;
                            color: var(--reader-muted);
                        }

                        .words__empty {
                            margin: 0;
                            font-size: 13px;
                            color: var(--reader-muted);
                        }

                        .words__list {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 8px;
                        }

                        .word {
                            display: inline-flex;
                            align-items: center;
                            gap: 4px;
                            padding: 4px 6px 4px 10px;
                            border: 1px solid var(--reader-line);
                            border-radius: 999px;
                            background: var(--reader-bg);
                        }

                        .word--active {
                            border-color: var(--reader-accent);
                            box-shadow: 0 0 0 2px var(--reader-accent-soft);
                        }

                        .word--missing {
                            border-color: #c0562f;
                            background: #f7ece7;
                        }

                        .word__text {
                            border: none;
                            background: transparent;
                            cursor: pointer;
                            font-family: var(--font-jp);
                            font-size: 15px;
                            color: var(--reader-ink);
                        }

                        .word--missing .word__text {
                            color: #a8491f;
                        }

                        .displayBlock {
                            display: block;
                            width: 100%;
                        }

                        .weditor__footer {
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

                        .btn--ghost:hover:not(:disabled) {
                            border-color: var(--reader-accent);
                            color: var(--reader-accent);
                        }

                        .btn:disabled {
                            opacity: .55;
                            cursor: not-allowed;
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
                imports        : [
                    ButtonModule, CdkDropList, FormsModule, InputModule, NgForOf, NgIf, ReactiveFormsModule, TextInputComponent, WriterPipesModule, SearchDropdownInputComponent, DeleteButtonComponent,
                    CdkDrag
                ]
            } )
export class WordEditorComponent implements OnInit {
    @Input()
    paragraph!: ParagraphDto;

    @Input()
    possibleTranslations!: DictionaryWordDto[];

    icon = IconEnum;

    @Output()
    onOnWordFieldFilled: EventEmitter<string> = new EventEmitter();
    @Output()
    onClearDictionaryWordsList = new EventEmitter();
    @Output()
    onOpenAddDictionaryModalClicked = new EventEmitter();
    @Output()
    onWordTranslationSubmitted: EventEmitter<CreateWordTranslationForParagraphDto> = new EventEmitter();
    @Output()
    onProcessWithAiClicked: EventEmitter<string> = new EventEmitter();

    displayText!: SafeHtml;
    translatedParagraph: EditableWordTranslation[] = [];
    selectedWord: EditableWordTranslation | null = null;
    selectedIndex: number | null = null;

    form!: FormGroup<{
        originalWord: FormControl<string>,
        dictionaryWordId: FormControl<string>,
        wordKanji: FormControl<string>,
        wordKana: FormControl<string>,
        observation: FormControl<string>,
    }>;

    @ViewChild( SearchDropdownInputComponent )
    translationDropdown?: SearchDropdownInputComponent<DictionaryWordDto>;

    constructor(private sanitizer: DomSanitizer,
                private _formBuilder: FormBuilder) {
    }

    createFormBuilder() {
        this.form = this._formBuilder.nonNullable.group( {
                                                             originalWord    : '',
                                                             dictionaryWordId: '',
                                                             wordKanji       : '',
                                                             wordKana        : '',
                                                             observation     : ''
                                                         } );
    }

    processWithAi() {
        this.onProcessWithAiClicked.emit( this.paragraph.id );
    }

    submitTranslation() {
        this.onWordTranslationSubmitted.emit( {
                                                  paragraphId: this.paragraph.id,
                                                  words      : this.translatedParagraph.map( (word, index) => {
                                                      return {
                                                          originalWord    : word.originalWord,
                                                          dictionaryWordId: word.dictionaryWordId,
                                                          wordKana        : word.wordKana,
                                                          wordKanji       : word.wordKanji,
                                                          observation     : word.observation,
                                                          order           : index
                                                      };
                                                  } )
                                              } );
    }

    displayDictionaryWord = (word: DictionaryWordDto) => `${ word.dictionaryForm } (${ word.kana })`;

    addWord(event: MouseEvent) {
        const selection = window.getSelection();
        if( !selection ) {
            return;
        }

        const originalWord = selection.toString()
                                      .trim();
        if( !originalWord ) {
            // A plain click in the paragraph (no text selected) deselects the current word.
            this.deselectWord();
            return;
        }

        const word: EditableWordTranslation = { originalWord } as EditableWordTranslation;
        this.translatedParagraph.push( word );
        this.updateTextWithAllHighlights();
        selection.removeAllRanges();
        this.setAsSelectedWord( word, this.translatedParagraph.length - 1 );
    }

    /** Clears the selection and resets the edit box (fields + translation dropdown). */
    deselectWord(): void {
        this.selectedWord = null;
        this.selectedIndex = null;
        this.clearFormValues();
        this.translationDropdown?.showSelection( null );
    }

    ngOnInit(): void {
        // @ts-ignore
        this.translatedParagraph = this.paragraph.words
                                   ? this.paragraph.words.map( word => (
                {
                    originalWord    : word.originalWord,
                    wordKanji       : word.wordKanji,
                    wordKana        : word.wordKana,
                    dictionaryWordId: word.translation?.id ?? '',
                    dictionaryWord  : word.translation,
                    observation     : word.observation,
                    order           :
                    word.order
                }
            ) )
                                   :
                                   [];
        this.updateTextWithAllHighlights();
        this.createFormBuilder();
    }

    removeWord(index: number): void {
        this.translatedParagraph.splice( index, 1 );

        let updatedText = this.paragraph.originalParagraph;
        this.translatedParagraph.forEach( (text) => {
            const regex = new RegExp( `(${text.originalWord})`, 'g' );
            updatedText = updatedText.replace(
                regex,
                '<span class="grayed-out">$1</span>'
            );
        } );
        this.displayText = this.sanitizeText( updatedText );

        // Keep the edit box in sync with what was removed.
        if( this.selectedIndex === index ) {
            // The selected word itself was deleted — clear the edit box.
            this.deselectWord();
        } else if( this.selectedIndex !== null && index < this.selectedIndex ) {
            // A word before the selected one was removed — the selection shifted down by one.
            this.selectedIndex--;
            this.selectedWord = this.translatedParagraph[this.selectedIndex] ?? null;
        }
    }

    sanitizeText(text: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml( text );
    }

    drop(event: CdkDragDrop<EditableWordTranslation[]>): void {
        moveItemInArray( this.translatedParagraph, event.previousIndex, event.currentIndex );
        this.updateTextWithAllHighlights();
        this.setAsSelectedWord( this.translatedParagraph[event.currentIndex], event.currentIndex );
    }

    setAsSelectedWord(word: EditableWordTranslation, index: number) {
        this.selectedWord = word;
        this.selectedIndex = index;

        this.form.controls.originalWord.setValue( word.originalWord );
        this.form.controls.dictionaryWordId.setValue( word.dictionaryWordId ?? '' );
        this.form.controls.wordKana.setValue( word.wordKana );
        this.form.controls.wordKanji.setValue( word.wordKanji ?? '' );
        this.form.controls.observation.setValue( word.observation ?? '' );
        // Drive the translation dropdown off this word's own chosen entry so it reflects the
        // current selection (and clears for an unfilled word). Done imperatively because a
        // bound [initialValue] does not re-run when switching between two empty selections.
        this.translationDropdown?.showSelection( word.dictionaryWord );
    }

    onTranslationSelected(dictionaryWord: DictionaryWordDto) {
        if( this.selectedWord ) {
            this.selectedWord.dictionaryWord = dictionaryWord;
            this.selectedWord.dictionaryWordId = dictionaryWord.id;
        }
    }

    /**
     * Emptying the search box deselects the translation: drop it from the form and the
     * selected row so it does not come back when switching away and back. Non-empty text
     * is just an in-progress search and leaves the current selection untouched.
     */
    onTranslationTextChange(text: string) {
        if( text?.trim() ) {
            return;
        }
        this.form.controls.dictionaryWordId.setValue( '' );
        if( this.selectedWord ) {
            this.selectedWord.dictionaryWord = undefined;
            this.selectedWord.dictionaryWordId = '';
        }
    }

    editWord() {
        if( this.selectedIndex !== null ) {
            this.translatedParagraph[this.selectedIndex].originalWord = this.form.controls.originalWord.getRawValue();
            this.translatedParagraph[this.selectedIndex].dictionaryWordId = this.form.controls.dictionaryWordId.getRawValue();
            this.translatedParagraph[this.selectedIndex].wordKanji = this.form.controls.wordKanji.getRawValue();
            this.translatedParagraph[this.selectedIndex].wordKana = this.form.controls.wordKana.getRawValue();
            this.translatedParagraph[this.selectedIndex].observation = this.form.controls.observation.getRawValue();
        }

        this.selectedIndex = null;
        this.selectedWord = null;
    }

    handleGetWordTranslation(word: string) {
        if( word ) {
            this.onOnWordFieldFilled.emit( word );
        }
    }

    clearDictionaryWordList() {
        this.onClearDictionaryWordsList.emit();
    }

    openAddWordToDictionaryFormModal() {
        this.onOpenAddDictionaryModalClicked.emit();
    }

    //TODO redo function and check if it can be united with the one for sentences
    updateTextWithAllHighlights(): void {
        let updatedText = '';

        for( const text of this.translatedParagraph ) {
            if( this.paragraph.originalParagraph.startsWith( updatedText + text.originalWord ) ) {
                updatedText += text.originalWord;
            } else {
                break;
            }
        }

        const restOfText = this.paragraph.originalParagraph.slice( updatedText.length );

        this.displayText = this.sanitizeText(
            `<span style="color: gray; pointer-events: none;">${ updatedText }</span>${ restOfText }`
        );
    }

    clearFormValues(): void {
        this.form.controls.originalWord.setValue( '' );
        this.form.controls.dictionaryWordId.setValue( '' );
        this.form.controls.wordKana.setValue( '' );
        this.form.controls.wordKanji.setValue( '' );
        this.form.controls.observation.setValue( '' );
    }
}
