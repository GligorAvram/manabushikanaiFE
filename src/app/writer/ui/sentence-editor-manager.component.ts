import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CreateDictionaryWordDto, ParagraphDto} from 'app/models/Api';
import {UntilDestroy} from 'ngx-reactivetoolkit';
import {SliderComponent} from "@shared/ui/slider.component";
import {ModalService} from '@shared/features/modal/modal.service';
import {ModalModule} from '@shared/features/modal/modal.module';
import {MatCard} from "@angular/material/card";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SentenceEditorComponent} from "@writer/ui/sentence-editor.component";
import {WordEditorComponent} from "@writer/ui/word-editor.component";
import {of} from "rxjs";
import {AddWordToDictionaryFormModalComponent} from "@writer/ui/add-word-to-dictionary-form-modal.component";
import {CreateDictionaryWordFormModalData} from "@writer/config/writer.interfaces";
import {IconEnum} from "@shared/config/enums/icon.enum";
import {ButtonModule} from "@shared/ui/buttons/button.module";
import {PrimaryButtonComponent} from "@shared/ui/buttons/primary-button.component";

@Component({
  selector: 'app-sentence-editor-manager',
  standalone: true,
  template: `
    <app-slider
      [rightOption]="sentenceView"
      [leftOption]="wordView"
      (onChange)="setSelected($event)"
    ></app-slider>
    <div>
      <app-primary-button
        label="Add word to dictionary"
        [icon]="icon.Add"
        appButton
        (click)="openAddWordToDictionaryFormModal()"
      ></app-primary-button>
    </div>
    <mat-card>
      <mat-stepper [linear]="false" #stepper>
        <mat-step *ngFor="let paragraph of paragraphs" [stepControl]="firstFormGroup">
          <app-sentence-editor *ngIf="selected===sentenceView"
                               [paragraph]="paragraph"
                               (onTranslationSubmitted)="submitParagraphTranslation($event)"
          ></app-sentence-editor>
          <ng-container>
            <app-word-editor *ngIf="selected===wordView"
                             [paragraph]="paragraph"
            ></app-word-editor>
          </ng-container>
        </mat-step>
      </mat-stepper>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SliderComponent,
    ModalModule,
    MatCard,
    MatStepper,
    MatStep,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    SentenceEditorComponent,
    WordEditorComponent,
    ButtonModule,
    PrimaryButtonComponent
  ],
})
@UntilDestroy()
export class SentenceEditorComponentManager {
  @Input()
  paragraphs!: ParagraphDto[];

  @Output()
  onTranslationSubmitted = new EventEmitter<ParagraphDto>();

  @Output()
  dictionaryWordSubmitted = new EventEmitter<CreateDictionaryWordDto>();

  sentenceView = 'Sentence view';
  wordView = 'Word view';
  selected: string | undefined = this.wordView;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: [''],
  });

  setSelected(value: string | undefined) {
    this.selected = value;
  }

  constructor(public readonly modalService: ModalService,
              private _formBuilder: FormBuilder) {
  }

  submitParagraphTranslation(translation: any) {
    this.onTranslationSubmitted.emit(translation);
  }

  submitWordsTranslation(event: any) {
    console.log(event);
  }


  submitDictionaryWord(word: CreateDictionaryWordDto) {
    this.dictionaryWordSubmitted.emit(word);
    this.onWordAddedToDictionarySuccessfully();
  }

  onWordAddedToDictionarySuccessfully() {
    this.closeAddWordToDictioanryFormModal()
  }

  openAddWordToDictionaryFormModal() {
    this.modalService.openMdModal<CreateDictionaryWordFormModalData>(
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

  protected readonly icon = IconEnum;
}
