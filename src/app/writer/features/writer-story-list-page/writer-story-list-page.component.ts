import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { WriterStoryListDataService } from "./writer-story-list-data.service";
import { UntilDestroy } from "ngx-reactivetoolkit";
import { IconEnum } from "@shared/config/enums/icon.enum";
import { NavigationService } from "@shared/features/navigation/navigation.service";

@Component({
  selector: 'app-writer-story-list-page',
  template: `
    <app-header>
      <app-title
        headerLeft
        title="Story management page"
        [icon]="icon"
      ></app-title>
    </app-header>

    <app-container *ngIf="(dataService.data$ | async)! as data">
      <app-story-list-table
        [stories]="data.entities"
        [loading]="data.loading"
        (onRowClick)="navigationService.storyDetails($event.id)"
      ></app-story-list-table>
    </app-container>
  `,
  providers: [WriterStoryListDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class WriterStoryListPageComponent implements OnInit {
  icon = IconEnum.Stories;

  constructor(
    public readonly dataService: WriterStoryListDataService,
    public readonly navigationService: NavigationService,
  ) {}

  ngOnInit(): void {
    this.dataService.init(this);
    this.dataService.data$.subscribe(console.log);
  }

  openStoryCreateFormModal() {
    console.log('to implement');
  }
}