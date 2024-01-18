import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-writer-story-create-page',
  template: `
    <app-container>      
      create stories
    </app-container>
    assaas
  `,
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WriterStoryCreatePageComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('writer Method not implemented.');
  }
}
