import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {IconEnum} from "@shared/config/enums/icon.enum";
import {ReaderStoryListDataService} from "@reader/features/reader-story-list-page/reader-story-list-data.service";
import {NavigationService} from "@shared/features/navigation/navigation.service";
import {UntilDestroy} from "ngx-reactivetoolkit";

@Component({
  selector: 'app-reader-story-list-page',
  template: `
    <app-container>
      <app-header>
        <app-title headerLeft title="Stories" [icon]="icon.Stories"></app-title>
      </app-header>
      <app-story-list-cards *ngIf="dataService.data$ | async as data"
                            [stories]="data.stories"
                            [loading]="data.loading"
      ></app-story-list-cards>
    </app-container>
  `,
  providers: [ReaderStoryListDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class ReaderStoryListPageComponent implements OnInit {

  icon = IconEnum;

  constructor(
    public readonly dataService: ReaderStoryListDataService,
    public readonly navigationService: NavigationService
  ) {
  }

  ngOnInit(): void {
    this.dataService.init(this);
  }
}
