import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { IconEnum } from "@shared/config/enums/icon.enum";
import { StoryDto } from "app/models/Api";

@Component({
  selector: 'app-reader-story-list-page',
  template: `
    <app-container>
      <app-header>
        <app-title headerLeft title="Stories" [icon]="icon.Stories"></app-title>
      </app-header>
      <app-story-list-table
        [stories]="stories"
        [loading]="false"
      ></app-story-list-table>
    </app-container>
  `,
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReaderStoryListPageComponent implements OnInit {
  ngOnInit(): void {}
  icon = IconEnum;

  stories: StoryDto[] = [];
}