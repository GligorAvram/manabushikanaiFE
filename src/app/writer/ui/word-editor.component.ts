import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {
  CreateWordTranslationDto,
  CreateWordTranslationForParagraphDto,
  DictionaryWordDto,
  ParagraphDto
} from "app/models/Api";
import {ButtonModule} from "@shared/ui/buttons/button.module";
import {IconEnum} from "@shared/config/enums/icon.enum";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {ContainerComponent} from "@shared/ui/container.component";
import {InputModule} from "@shared/ui/input/input.module";
import {MatCard, MatCardContent} from "@angular/material/card";
import {NgForOf, NgIf} from "@angular/common";
import {PrimaryButtonComponent} from "@shared/ui/buttons/primary-button.component";
import {TextInputComponent} from "@shared/ui/input/text-input.component";
import {WriterPipesModule} from "@writer/pipes/writer-pipes.module";
import {SearchDropdownInputComponent} from "@shared/ui/input/search-dropdown-input.component";
import {DeleteButtonComponent} from "@shared/ui/buttons/delete-button.component";

@Component({
  selector: 'app-word-editor',
  template: `
    <app-container *ngIf="paragraph">
      <div>
        <app-primary-button
          label="Add word to dictionary"
          [icon]="icon.Add"
          appButton
          (click)="openAddWordToDictionaryFormModal()"
        ></app-primary-button>
      </div>
      <mat-card>
        <div
          [innerHTML]="displayText"
          (mouseup)="addWord($event)"
          class="text-container"
          matTooltip="Select text to add it to the list."
        ></div>
      </mat-card>
    </app-container>

    <app-container>
      <mat-card>
        <mat-card-content style="display: flex; flex-direction: row;">

          <div style="min-width: 5rem">
            <div
              cdkDropList
              [cdkDropListData]="translatedParagraph"
              class="example-list"

              (cdkDropListDropped)="drop($event)">
              <div *ngFor="let item of translatedParagraph; let i = index">
                <div class="example-box" cdkDrag
                     (click)="setAsSelectedWord(item, i)"
                >{{ item.originalWord }}
                </div>
                <app-delete-button
                  appButton
                  (click)="removeWord(i)"
                ></app-delete-button>
              </div>
            </div>
          </div>

          <div>
            <div>
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
                                           (clearOptionsList)="clearDictionaryWordList()"
                                           [label]="'Search for translation'"
                                           [placeholder]="'Search for a translation...'"
                                           [control]="form.controls.dictionaryWordId"
                                           [searchResults]="possibleTranslations"
                                           [displayFn]="displayDictionaryWord"
                                           [initialValue]="initialValue"
                />
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
                <button type="submit" [disabled]="!form.valid">Submit</button>
              </form>
            </div>
          </div>

        </mat-card-content>
      </mat-card>
      <div>
        <app-primary-button
          label="Add paragraph translation"
          [icon]="icon.Add"
          appButton
          (click)="submitTranslation()"
        ></app-primary-button>
      </div>
    </app-container>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, CdkDrag, CdkDropList, ContainerComponent, FormsModule, InputModule, MatCard, MatCardContent, NgForOf, NgIf, PrimaryButtonComponent, ReactiveFormsModule, TextInputComponent, WriterPipesModule, SearchDropdownInputComponent, DeleteButtonComponent],
})
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

  displayText!: SafeHtml
  translatedParagraph: CreateWordTranslationDto[] = [];
  selectedWord: CreateWordTranslationDto | null = null
  selectedIndex: number | null = null;

  form!: FormGroup<{
    originalWord: FormControl<string>,
    dictionaryWordId: FormControl<string>,
    wordKanji: FormControl<string>,
    wordKana: FormControl<string>,
    observation: FormControl<string>,
  }>;

  initialValue: DictionaryWordDto | undefined;

  constructor(private sanitizer: DomSanitizer,
              private _formBuilder: FormBuilder) {
  }

  createFormBuilder() {
    this.form = this._formBuilder.nonNullable.group({
      originalWord: "",
      dictionaryWordId: "",
      wordKanji: "",
      wordKana: "",
      observation: ""
    })
  }

  submitTranslation() {
    this.onWordTranslationSubmitted.emit({
      paragraphId: this.paragraph.id,
      words: this.translatedParagraph.map((word, index) => {
        return {
          originalWord: word.originalWord,
          dictionaryWordId: word.dictionaryWordId,
          wordKana: word.wordKana,
          wordKanji: word.wordKanji,
          observation: word.observation,
          order: index
        }
      })
    })
  }

  displayDictionaryWord = (word: DictionaryWordDto) => word.dictionaryForm;

  addWord(event: MouseEvent) {
    const selection = window.getSelection();
    if (!selection) return;

    const originalWord = selection.toString().trim();
    if (originalWord) {
      const word: CreateWordTranslationDto = {originalWord} as CreateWordTranslationDto
      this.translatedParagraph.push(word);
      this.updateTextWithAllHighlights();
      selection.removeAllRanges();
      this.setAsSelectedWord(word, this.translatedParagraph.length - 1)
    }
  }

  ngOnInit(): void {
    // @ts-ignore
    this.translatedParagraph = this.paragraph.words ? this.paragraph.words.map(word => ({
        originalWord: word.originalWord,
        wordKanji: word.wordKanji,
        wordKana: word.wordKana,
        dictionaryWordId: word.translation ?? "",
        observation: word.observation,
        order:
        word.order
      })) :
      [];
    this.displayText = this.sanitizeText(this.paragraph.originalParagraph);
    this.createFormBuilder();
    this.dictionaryWordInitialValue()
  }

  removeWord(index: number): void {
    this.translatedParagraph.splice(index, 1);

    let updatedText = this.paragraph.originalParagraph;
    this.translatedParagraph.forEach((text) => {
      const regex = new RegExp(`(${text.originalWord})`, 'g');
      updatedText = updatedText.replace(
        regex,
        '<span class="grayed-out">$1</span>'
      );
    });
    this.displayText = this.sanitizeText(updatedText);
  }

  sanitizeText(text: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  drop(event: CdkDragDrop<CreateWordTranslationDto[]>): void {
    moveItemInArray(this.translatedParagraph, event.previousIndex, event.currentIndex);
    this.updateTextWithAllHighlights();
    this.setAsSelectedWord(this.translatedParagraph[event.currentIndex], event.currentIndex)
  }

  setAsSelectedWord(word: CreateWordTranslationDto, index: number) {
    this.selectedWord = word;
    this.selectedIndex = index;

    this.form.controls.originalWord.setValue(word.originalWord);
    this.form.controls.dictionaryWordId.setValue(word.dictionaryWordId!);
    this.form.controls.wordKana.setValue(word.wordKana);
    if (word.wordKanji != null) {
      this.form.controls.wordKanji.setValue(word.wordKanji);
    }
    if (word.observation != null) {
      this.form.controls.observation.setValue(word.observation);
    }
    this.dictionaryWordInitialValue(word)
  }

  editWord() {
    if (this.selectedIndex !== null) {
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
    if (word) {
      this.onOnWordFieldFilled.emit(word);
    }
  }

  clearDictionaryWordList() {
    this.onClearDictionaryWordsList.emit();
  }

  openAddWordToDictionaryFormModal() {
    this.onOpenAddDictionaryModalClicked.emit()
  }

  //TODO there can be only 1 (unite this and the one for sentences)
  updateTextWithAllHighlights(): void {
    let updatedText = this.paragraph.originalParagraph;
    let lastIndex = 0;

    this.translatedParagraph.forEach((text) => {
      const regex = new RegExp(`(${text.originalWord})`, 'g');
      const match = updatedText.match(regex);

      if (match) {
        const index = updatedText.indexOf(text.originalWord);

        if (index >= lastIndex) {
          // Only gray-out texts that are sequential
          updatedText = updatedText.replace(
            regex,
            '<span class="grayed-out">$1</span>'
          );
          lastIndex = index + text.originalWord.length; // Update the last matched index
        }
      }
    });

    this.displayText = this.sanitizeText(updatedText);
  }

  dictionaryWordInitialValue(word?: CreateWordTranslationDto) {
    if (word) {
      this.initialValue = this.paragraph.words?.find(m => m.originalWord === word?.originalWord)?.translation;
    }
  }
}
