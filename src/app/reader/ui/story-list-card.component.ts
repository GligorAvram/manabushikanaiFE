import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { StoryDto } from '@models/Api';
import { valueIsNotEmpty } from '@shared/functions';
import { ByteArrayImage } from '@shared/ui/byte-array-image.component';
import { ContainerComponent } from '@shared/ui/container.component';

@Component({
  selector: "app-story-list-cards",
  standalone: true,
  template: `
      <app-container>
          <mat-grid-list cols="5" rowHeight="250px" gutterSize="10">
              @for (story of stories; track story) {
                  <mat-grid-tile>
                      <mat-card class="story-card" appearance="outlined" (click)="cardClicked(story)">
                          <mat-card-header>
                              <app-byte-array-image [image]="story.image"></app-byte-array-image>
                          </mat-card-header>
                          <mat-card-content>
                              <mat-card-title>{{ story.name }}</mat-card-title>
                              <mat-card-subtitle>
                                  {{ story.description }}
                              </mat-card-subtitle>
                          </mat-card-content>
                          <mat-card-footer> Origin: {{ story.storyOrigin }}</mat-card-footer>
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
    stories!: StoryDto[];

    @Output()
    onCardClick: EventEmitter<StoryDto> = new EventEmitter();

    @Input()
    loading: boolean = true;

    cardClicked(story: StoryDto): void {
        if( valueIsNotEmpty( story ) ) {
            this.onCardClick.emit( story );
        }
    }
}
