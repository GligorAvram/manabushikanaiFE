import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {WriterStoryDetailsDataService} from "./writer-story-details-data.service";
import {UntilDestroy} from "ngx-reactivetoolkit";
import {
  CreateDictionaryWordDto,
  CreateParagraphTranslationDto,
  CreateWordTranslationForParagraphDto,
  ParagraphDto
} from "app/models/Api";
import {FormBuilder} from "@angular/forms";
import {IconEnum} from "@shared/config/enums/icon.enum";
import {CreateDictionaryWordFormModalData} from "@writer/config/writer.interfaces";
import {AddWordToDictionaryFormModalComponent} from "@writer/ui/add-word-to-dictionary-form-modal.component";
import {of} from "rxjs";
import {ModalService} from "@shared/features/modal/modal.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-writer-story-details-page',
  template: `
    <app-container *ngIf="dataService.data$ | async as data">
      <app-loading-bar [visible]="data.loading"></app-loading-bar>
      <app-slider
        [rightOption]="sentenceView"
        [leftOption]="wordView"
        (onChange)="setSelected($event)"
      ></app-slider>

      <app-container *ngIf="data">
        <div>
          <mat-paginator [length]="data.paragraphs?.totalItems"
                         [pageSize]="10"
                         [pageSizeOptions]="[10]"
                         (page)="handlePageEvent($event)"
                         [hidePageSize]="true"
                         aria-label="Select page">
          </mat-paginator>
        </div>

        <mat-stepper [linear]="false" #stepper>
          <mat-step *ngFor="let paragraph of data.paragraphs!.paragraphs" [stepControl]="firstFormGroup"
                    [completed]="checkIfCompleted(paragraph)">

            <app-container *ngIf="selected===sentenceView">
              <app-sentence-editor
                [paragraph]="paragraph"
                (onTranslationSubmitted)="submitTranslationForParagraph($event)"
              ></app-sentence-editor>
            </app-container>
            <app-container *ngIf="selected===wordView">
              <app-word-editor
                [paragraph]="paragraph"
                (onOnWordFieldFilled)="getTranslationForWord($event)"
                (onClearDictionaryWordsList)="clearWordTranslations()"
                [possibleTranslations]="data.possibleWordTranslations"
                (onWordTranslationSubmitted)="submitWordsTranslation($event)"
                (onOpenAddDictionaryModalClicked)="this.openAddWordToDictionaryFormModal()"
              ></app-word-editor>
            </app-container>
          </mat-step>
        </mat-stepper>
        <app-primary-button appButton (click)="publishStory()" label="Publish story"></app-primary-button>
      </app-container>
    </app-container>
  `,
  providers: [
    WriterStoryDetailsDataService,
    ModalService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class WriterStoryDetailsPageComponent implements OnInit {

  firstFormGroup = this._formBuilder.group({
    firstCtrl: [''],
  });
  protected readonly icon = IconEnum;
  protected sentenceView = 'Sentence view';
  protected wordView = 'Word view';
  selected: string | undefined = this.wordView;

  constructor(
    public readonly dataService: WriterStoryDetailsDataService,
    public readonly modalService: ModalService,
    private _formBuilder: FormBuilder
  ) {
  }

  setSelected(value: string | undefined) {
    this.selected = value;
  }

  ngOnInit(): void {
    this.dataService.init(this);
  }

  submitTranslationForParagraph(paragraphTranslation: CreateParagraphTranslationDto) {
    this.dataService.submitTranslationForParagraph(paragraphTranslation);
  }

  getTranslationForWord(word: string) {
    this.dataService.getTranslationForWord(word)
  }

  clearWordTranslations() {
    this.dataService.clearPossibleDictionaryWordList();
  }

  submitWordsTranslation(data: CreateWordTranslationForParagraphDto) {
    this.dataService.submitWordTranslationToParagraph(data)
  }

  submitDictionaryWord(word: CreateDictionaryWordDto) {
    this.dataService.submitWordToDictionary(word);
    this.onWordAddedToDictionarySuccessfully();
  }

  onWordAddedToDictionarySuccessfully() {
    this.closeAddWordToDictionaryFormModal()
  }

  openAddWordToDictionaryFormModal() {
    this.modalService.openMdModal<CreateDictionaryWordFormModalData>(
      AddWordToDictionaryFormModalComponent,
      this,
      {
        loading$: of(false),
        onSubmit: this.submitDictionaryWord.bind(this),
        onCancel: this.closeAddWordToDictionaryFormModal.bind(this),
      },
    );
  }

  closeAddWordToDictionaryFormModal(): void {
    this.modalService.close(AddWordToDictionaryFormModalComponent);
  }

  handlePageEvent($event: PageEvent) {
    this.dataService.loadParagraphs({pageSize: 10, pageNumber: $event.pageIndex})
  }

  checkIfCompleted(paragraph: ParagraphDto) {
    if (this.selected === this.sentenceView) {
      return paragraph.translationDone;
    }
    return paragraph.wordsDone;
  }

  publishStory() {
    this.dataService.publishStory()
  }
}
