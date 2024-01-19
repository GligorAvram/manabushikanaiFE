import { NgModule } from "@angular/core";
import { WriterStoryListPageComponent } from './writer-story-list-page.component';
import { ContainerComponent } from "@shared/ui/container.component";
import { StoryListTableComponent } from "@shared/ui/story-list-table.component";
import { WriterStoryListPageRoutingModule } from "./writer-story-list-page-routing.module";
import { CommonModule } from "@angular/common";
import { WriterDataModule } from "@writer/data/writer-data.module";
import { HeaderComponent } from "@shared/ui/header.component";
import { TitleComponent } from "@shared/ui/title.component";
import { ButtonModule } from "@shared/ui/buttons/button.module";

@NgModule({
  declarations: [WriterStoryListPageComponent],
  imports: [
    ContainerComponent,
    WriterStoryListPageRoutingModule,
    StoryListTableComponent,
    CommonModule,
    WriterDataModule,
    HeaderComponent,
    TitleComponent,
    ButtonModule,
  ],
})
export class WriterStoryListPageModule {}
