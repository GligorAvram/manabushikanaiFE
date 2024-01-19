import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { WriterStoryListDataService } from "./writer-story-list-data.service";
import { UntilDestroy } from "ngx-reactivetoolkit";
import { ComponentDataSource } from "@shared/data/component-data.service";

@Component({
  selector: 'app-writer-story-list-page',
  template: `
    writer stories
    <ng-container *ngIf="(dataService.data$ | async)! as data">
      <app-story-list-table></app-story-list-table> 
      <ul> 
        <li *ngFor="let story of data.entities">{{ story.name }}</li> 
      </ul>
      <br />
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
    this.dataService.data$.subscribe(console.log)
  }
}