import { NgModule } from "@angular/core";
import { WriterStoryDetailsPageComponent } from "./writer-story-details-page.component";
import { WriterStoryDetailsPageRoutingModule } from "./writer-story-details-page-routing.module";
import { CommonModule } from "@angular/common";
import { LoadingBarComponent } from "@shared/ui/loading-bar.component";
import { WriterDataModule } from "@writer/data/writer-data.module";

@NgModule({
  declarations: [WriterStoryDetailsPageComponent],
  imports: [
    CommonModule,
    WriterStoryDetailsPageRoutingModule,
    LoadingBarComponent,
    WriterDataModule,
  ],
})
export class WriterStoryDetailsPageModule {}