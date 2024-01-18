import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { WriterStoryListDataService } from "./writer-story-list-data.service";
import { UntilDestroy } from "ngx-reactivetoolkit";

@Component({
  selector: 'app-writer-story-list-page',
  template: `
    writer stories
    <ng-container *ngIf="(dataService.data$ | async)! as data">
      <!-- <app-story-list-table></app-story-list-table> -->
      <!-- <ul *ngIf="dataService.data$"> -->
      <!-- <li *ngFor="let story of stories$ | async">{{ story.name }}</li> -->
      <!-- </ul> -->
      <br />
      <span *ngFor="let story of data">{{ story.name }}</span>
      <span>{{ data[0].id }}</span>
    </ng-container>
  `,
  providers: [WriterStoryListDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class WriterStoryListPageComponent implements OnInit {
  // stories$!: Observable<StoryDto[]>;

  constructor(public readonly dataService: WriterStoryListDataService) {}

  ngOnInit(): void {
    this.dataService.init(this);
  }
}