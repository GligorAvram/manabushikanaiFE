import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateDictionaryWordDto, CreateParagraphTranslationDto, ParagraphDto, SentenceDto } from 'app/models/Api';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { ContainerComponent } from '@shared/ui/container.component';
import { SliderComponent } from "@shared/ui/slider.component";
import { WordEditorComponent } from "@writer/ui/word-editor.component";
import { ParagraphEditorComponent } from '@writer/ui/sentence-editor.component';
import { ModalService } from '@shared/features/modal/modal.service';
import { of } from 'rxjs';
import { CreateDictionaryWordFormModalComponent } from './add-word-to-dictionary-form-modal.component';
import { AddWordToDictionaryFormModalData } from '@writer/config/writer.interfaces';
import { ModalModule } from '@shared/features/modal/modal.module';

@Component({
  selector: 'app-sentence-editor-manager',
  standalone: true,
  template: `
    <app-slider
      [rightOption]="sentenceView"
      [leftOption]="wordView"
      (onChange)="setSelected($event)"
    ></app-slider>
    <ng-container *ngIf="selected == sentenceView">
      <app-paragraph-editor
        [paragraphs]="paragraphs"
        (onTranslationSubmitted)="submitTranslation($event)"
      ></app-paragraph-editor>
    </ng-container>
    <ng-container *ngIf="selected == wordView">
      <app-word-editor
        [sentences]="paragraphs"
        (onTranslationSubmitted)="submitWordsTranslation($event)"
        (onAddWordToDictionaryClicked)="openAddWordToDictionaryFormModal()"
      ></app-word-editor>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ContainerComponent,
    SliderComponent,
    WordEditorComponent,
    ParagraphEditorComponent,
    ModalModule
  ],
})
@UntilDestroy()
export class SentenceEditorComponentManager {
  @Input()
  paragraphs!: ParagraphDto[];

  @Output()
  translationSubmitted = new EventEmitter<CreateParagraphTranslationDto>();

  @Output()
  dictionaryWordSubmitted = new EventEmitter<CreateDictionaryWordDto>();

  sentenceView = 'Paragraph view';
  wordView = 'Word view';
  selected: string | undefined = this.wordView;

  constructor(public readonly modalService: ModalService) {}

  setSelected(value: string | undefined) {
    this.selected = value;
  }

  submitTranslation(paragraphTranslation: CreateParagraphTranslationDto) {
    this.translationSubmitted.emit(paragraphTranslation);
  }

  submitWordsTranslation(event: any) {
    console.log(event);
  }

  submitDictionaryWord(word: CreateDictionaryWordDto) {
    this.dictionaryWordSubmitted.emit(word);
    this.onWordAddedToDictionarySuccessfully();
  }
  onWordAddedToDictionarySuccessfully() {
    this.closeAddWordToDictioanryFormModal();
  }

  openAddWordToDictionaryFormModal() {
    this.modalService.openMdModal<AddWordToDictionaryFormModalData>(
      CreateDictionaryWordFormModalComponent,
      this,
      {
        loading$: of(false),
        onSubmit: this.submitDictionaryWord.bind(this),
        onCancel: this.closeAddWordToDictioanryFormModal.bind(this),
      },
    );
  }

  closeAddWordToDictioanryFormModal(): void {
    this.modalService.close(CreateDictionaryWordFormModalComponent);
  }
}
