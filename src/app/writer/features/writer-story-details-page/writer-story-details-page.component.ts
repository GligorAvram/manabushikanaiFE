import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { WriterStoryDetailsDataService } from "./writer-story-details-data.service";
import { WriterActions } from "@writer/data/writer.actions";
import { WriterQueries } from "@writer/data/writer.queries";
import { BaseComponentDataService, ComponentDataSource } from "@shared/data/component-data.service";
import { NavigationService } from "@shared/features/navigation/navigation.service";

@Component({
  selector: '',
  template: `
    <ng-container *ngIf="(dataService.data$ | async)! as data">
      <app-loading-bar [visible]="data.loading"></app-loading-bar>
      <!-- <ng-container *ngIf="data as story"> </ng-container> -->
    </ng-container>
  `,
  providers: [WriterStoryDetailsDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WriterStoryDetailsPageComponent {

  constructor(
    public readonly dataService: WriterStoryDetailsDataService,
    public readonly navigationService: NavigationService,
  ) {}
}