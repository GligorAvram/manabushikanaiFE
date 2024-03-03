import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { StoryDto } from "app/models/Api";
import { LoadingBarComponent } from "./loading-bar.component";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table"
import { WriterPipesModule } from "@writer/pipes/writer-pipes.module";
import { valueIsNotEmpty } from "@shared/functions";


@Component({
  selector: 'app-story-list-table',
  template: `
    <app-loading-bar [visible]="loading"></app-loading-bar>
    <ng-container *ngIf="stories.length > 0 && !loading; else noData">
      <table mat-table [dataSource]="stories">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let story">
            <strong>{{ story | storyName }}</strong>
          </td>
        </ng-container>
        <ng-container matColumnDef="difficulty">
          <th mat-header-cell *matHeaderCellDef>Difficulty</th>
          <td mat-cell *matCellDef="let story">
            <strong>{{ story | storyDifficulty }}</strong>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: columns"
          (click)="rowClicked(row)"
        ></tr>
      </table>
    </ng-container>
    <ng-template #noData>
      <em>No stories</em>
    </ng-template>
  `,
  providers: [],
  styleUrl: "./table.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LoadingBarComponent,
    CommonModule,
    WriterPipesModule,
    MatTableModule,
  ],
})
export class StoryListTableComponent implements OnInit {
  @Input()
  stories!: StoryDto[];

  @Input()
  loading!: boolean;

  @Output()
  onRowClick = new EventEmitter<StoryDto | undefined>();

  columns: string[] = [];

  ngOnInit(): void {
    this.setColumns();
  }

  rowClicked(story: StoryDto): void {
    if(valueIsNotEmpty(story)){
      this.onRowClick.emit(story);
    }
  }

  private setColumns(): void {
    this.columns = ['name', 'difficulty'];
  }
}
