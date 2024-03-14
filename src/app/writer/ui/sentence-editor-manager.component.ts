import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AddWordToDictionaryDto, SentenceDto } from 'app/models/Api';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { ContainerComponent } from '@shared/ui/container.component';
import { SliderComponent } from "@shared/ui/slider.component";
import { WordEditorComponent } from "@writer/ui/word-editor.component";
import { SentenceEditorComponent } from '@writer/ui/sentence-editor.component';
import { ModalService } from '@shared/features/modal/modal.service';
import { of } from 'rxjs';
import { AddWordToDictionaryFormModalComponent } from './add-word-to-dictionary-form-modal.component';
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
      <app-sentence-editor
        [sentences]="sentences"
        (onTranslationSubmitted)="submitTranslation($event)"
      ></app-sentence-editor>
    </ng-container>
    <ng-container *ngIf="selected == wordView">
      <app-word-editor
        [sentences]="sentences"
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
    SentenceEditorComponent,
    ModalModule,
  ],
})
@UntilDestroy()
export class SentenceEditorComponentManager {
  @Input()
  sentences!: SentenceDto[];

  @Output()
  translationSubmitted = new EventEmitter<SentenceDto>();

  @Output()
  dictionaryWordSubmitted = new EventEmitter<AddWordToDictionaryDto>();

  sentenceView = 'Sentence view';
  wordView = 'Word view';
  selected: string | undefined = this.wordView;

  constructor(public readonly modalService: ModalService) {}

  setSelected(value: string | undefined) {
    this.selected = value;
  }

  submitTranslation(sentence: SentenceDto) {
    this.translationSubmitted.emit(sentence);
  }

  submitWordsTranslation(event: any) {
    console.log(event);
  }

  submitDictionaryWord(word: AddWordToDictionaryDto) {    
    this.dictionaryWordSubmitted.emit(word);
    this.onWordAddedToDictionarySuccessfully();
  }
  onWordAddedToDictionarySuccessfully() {
    this.closeAddWordToDictioanryFormModal()
  }


  openAddWordToDictionaryFormModal() {
    this.modalService.openMdModal<AddWordToDictionaryFormModalData>(
      AddWordToDictionaryFormModalComponent,
      this,
      {
        loading$: of(false),
        onSubmit: this.submitDictionaryWord.bind(this),
        onCancel: this.closeAddWordToDictioanryFormModal.bind(this),
      },
    );
  }

  closeAddWordToDictioanryFormModal(): void {
    this.modalService.close(AddWordToDictionaryFormModalComponent);
  }
}
