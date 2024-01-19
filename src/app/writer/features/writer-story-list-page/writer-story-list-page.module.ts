import { NgModule } from "@angular/core";
import { WriterStoryListPageComponent } from './writer-story-list-page.component';
import { ContainerComponent } from "@shared/ui/container.component";
import { StoryListTableComponent } from "@shared/ui/story-list-table.component";
import { WriterStoryListPageRoutingModule } from "./writer-story-list-page-routing.module";
import { CommonModule } from "@angular/common";
import { WriterDataModule } from "@writer/data/writer-data.module";

@NgModule({
  declarations: [WriterStoryListPageComponent],
  imports: [
    ContainerComponent,
    WriterStoryListPageRoutingModule,
    StoryListTableComponent,
    CommonModule, 
    WriterDataModule
  ],
})
export class WriterStoryListPageModule {}
