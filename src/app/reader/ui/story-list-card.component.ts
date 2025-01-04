import {Component, Input} from "@angular/core";
import {StoryDto} from "@models/Api";
import {ContainerComponent} from "@shared/ui/container.component";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {ByteArrayImage} from "@shared/ui/byte-array-image.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";

@Component({
  selector: "app-story-list-cards",
  standalone: true,
  template: `
    <app-container>
      <mat-grid-list cols="5" rowHeight="250px" gutterSize="10">
        @for (story of stories; track story) {
          <mat-grid-tile>
            <mat-card class="story-card" appearance="outlined">
              <mat-card-header>
                <app-byte-array-image [image]="story.image"></app-byte-array-image>
              </mat-card-header>
              <mat-card-content>
                <mat-card-title>{{ story.name }}</mat-card-title>
                <mat-card-subtitle>
                  {{ story.description }}
                </mat-card-subtitle>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
        }
      </mat-grid-list>


    </app-container>`,
  styles: [`
    .story-card {
      height: 250px;
    }
  `],
  imports: [
    ContainerComponent,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ByteArrayImage,
    MatGridList,
    MatGridTile
  ],
})
export class StoryListCardComponent {
  @Input()
  stories!: StoryDto[]

  @Input()
  loading: boolean = true;
}
