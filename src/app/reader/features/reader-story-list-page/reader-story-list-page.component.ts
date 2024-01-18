import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";

@Component({
  selector: 'app-reader-story-list-page',
  template: `
  reader stories
    <app-container>
      <app-story-list-table></app-story-list-table>
    </app-container>
  `,
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReaderStoryListPageComponent implements OnInit{

  ngOnInit(): void {  }


  
}