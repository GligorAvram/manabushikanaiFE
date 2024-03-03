import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { WriterStoryDetailsDataService } from "./writer-story-details-data.service";
import { NavigationService } from "@shared/features/navigation/navigation.service";
import { UntilDestroy } from "ngx-reactivetoolkit";
import { SentenceDto } from "app/models/Api";

@Component({
  selector: '',
  template: `
    <ng-container *ngIf="(dataService.data$ | async)! as data">
      <app-loading-bar [visible]="data.loading"></app-loading-bar>
      <app-sentence-editor-manager
        (translationSubmitted)="submitTranslation($event)"
        *ngIf="data.story"
        [sentences]="data.story!.sentences ?? []"
      >
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
  ) {}

  ngOnInit(): void {
    this.dataService.init(this);
  }

  submitTranslation(sentence: SentenceDto) {
    this.dataService.submitTranslationForSentence(sentence);
  }
}