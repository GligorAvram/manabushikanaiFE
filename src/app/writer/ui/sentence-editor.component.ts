import {CommonModule} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {CreateSentenceDto, ParagraphDto} from 'app/models/Api';
import {ContainerComponent} from '@shared/ui/container.component';
import {MatChipsModule} from "@angular/material/chips";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {CdkDragDrop, DragDropModule, moveItemInArray} from "@angular/cdk/drag-drop";
import {InputModule} from "@shared/ui/input/input.module";
import {TextInputComponent} from "@shared/ui/input/text-input.component";
import {IconEnum} from "@shared/config/enums/icon.enum";
import {ButtonModule} from "@shared/ui/buttons/button.module";
import {PrimaryButtonComponent} from "@shared/ui/buttons/primary-button.component";

export type PartialSentenceTranslation = { orig: string, translation: string | null }

@Component({
  selector: 'app-sentence-editor',
  template: `
    <app-container *ngIf="paragraph">
      <mat-card>
        <div
          [innerHTML]="displayText"
          (mouseup)="addSentence($event)"
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
              [cdkDropListData]="sentences"
              class="example-list"

              (cdkDropListDropped)="drop($event)">
              <div *ngFor="let item of sentences; let i = index">
                <div class="example-box" cdkDrag
                     (click)="setAsSelectedSentence(item, i)"
                >{{ item.orig }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div>
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
  styles: [
    `
      .text-container {
        cursor: text;
        user-select: text;
        padding: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      .grayed-out {
        color: gray;
        pointer-events: none;
      }

      mat-card {
        margin: 16px 0;
      }

      mat-chip {
        margin: 4px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ContainerComponent,
    MatChipsModule,
    DragDropModule,
    InputModule,
    TextInputComponent,
    ButtonModule,
    PrimaryButtonComponent
  ],
})
export class SentenceEditorComponent implements OnInit {
  @Input()
  paragraph!: ParagraphDto;

  @Output()
  onTranslationSubmitted: EventEmitter<{ sentences: CreateSentenceDto[], id: string }> = new EventEmitter();

  displayText!: SafeHtml
  sentences: PartialSentenceTranslation[] = [];
  selectedSentence: PartialSentenceTranslation | null = null
  selectedIndex: number | null = null;

  form!: FormGroup<{ orig: FormControl<string>, translation: FormControl<string> }>;
  protected readonly icon = IconEnum;

  constructor(private sanitizer: DomSanitizer,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.displayText = this.sanitizeText(this.paragraph.originalParagraph);
    this.createFormBuilder();
  }

  createFormBuilder() {
    this.form = this._formBuilder.nonNullable.group({
      orig: "",
      translation: "",
    })
  }

  submitTranslation() {
    this.onTranslationSubmitted.emit({
      sentences: this.sentences.map((e, index) => {
        return {
          japaneseSentence: e.orig,
          englishTranslation: e.translation!,
          order: index
        }
      }),
      id: this.paragraph.id
    })
  }

  addSentence(event: MouseEvent) {
    const selection = window.getSelection();
    if (!selection) return;

    const orig = selection.toString().trim();
    if (orig && !this.sentences.map(sentence => sentence.orig).includes(orig)) {
      const sentence = {orig, translation: null}
      this.sentences.push(sentence);
      this.updateTextWithAllHighlights();
      selection.removeAllRanges();
      this.setAsSelectedSentence(sentence, this.sentences.length - 1)
    }
  }

  updateTextWithAllHighlights(): void {
    let updatedText = this.paragraph.originalParagraph;
    let lastIndex = 0; // Track the last matched index for sequential validation

    this.sentences.forEach((text) => {
      const regex = new RegExp(`(${text.orig})`, 'g');
      const match = updatedText.match(regex);

      if (match) {
        const index = updatedText.indexOf(text.orig);

        if (index >= lastIndex) {
          // Only gray-out texts that are sequential
          updatedText = updatedText.replace(
            regex,
            '<span class="grayed-out">$1</span>'
          );
          lastIndex = index + text.orig.length; // Update the last matched index
        }
      }
    });

    this.displayText = this.sanitizeText(updatedText);
  }

  removeSentence(index: number): void {
    this.sentences.splice(index, 1);

    let updatedText = this.paragraph.originalParagraph;
    this.sentences.forEach((text) => {
      const regex = new RegExp(`(${text.orig})`, 'g');
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

  drop(event: CdkDragDrop<PartialSentenceTranslation[]>): void {
    moveItemInArray(this.sentences, event.previousIndex, event.currentIndex);
    this.updateTextWithAllHighlights();
    this.setAsSelectedSentence(this.sentences[event.currentIndex], event.currentIndex)
  }

  setAsSelectedSentence(sentence: PartialSentenceTranslation, index: number) {
    this.selectedSentence = sentence;
    this.selectedIndex = index;
    this.form.controls.orig.setValue(sentence.orig);
    this.form.controls.translation.setValue(sentence.translation!);
  }

  editSentence() {
    if (this.selectedIndex !== null) {
      this.sentences[this.selectedIndex].orig = this.form.controls.orig.getRawValue();
      this.sentences[this.selectedIndex].translation = this.form.controls.translation.getRawValue();
    }

    this.selectedIndex = null;
    this.selectedSentence = null;
  }
}
