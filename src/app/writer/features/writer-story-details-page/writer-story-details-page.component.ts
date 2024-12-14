import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {WriterStoryDetailsDataService} from "./writer-story-details-data.service";
import {NavigationService} from "@shared/features/navigation/navigation.service";
import {UntilDestroy} from "ngx-reactivetoolkit";
import {CreateDictionaryWordDto, CreateParagraphTranslationDto} from "app/models/Api";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-writer-story-details-page',
  template: `
    <ng-container *ngIf="(dataService.data$ | async)! as data">
      <app-loading-bar [visible]="data.loading"></app-loading-bar>
      <app-sentence-editor-manager
        (onTranslationSubmitted)="submitTranslationForParagraph($event)"
        *ngIf="data.story"
        (dictionaryWordSubmitted)="submitDictionaryWord($event)"
        [paragraphs]="data.paragraphs?.paragraphs ?? []">
      </app-sentence-editor-manager>
    </ng-container>
  `,
  providers: [WriterStoryDetailsDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class WriterStoryDetailsPageComponent implements OnInit {

  constructor(
    public readonly dataService: WriterStoryDetailsDataService,
    public readonly navigationService: NavigationService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dataService.init(this);
  }


  submitTranslationForParagraph(paragraphTranslation: CreateParagraphTranslationDto) {
    this.dataService.submitTranslationForParagraph(paragraphTranslation);
  }

  submitDictionaryWord(word: CreateDictionaryWordDto) {
    this.dataService.submitWordToDictionary(word);
  }
}
