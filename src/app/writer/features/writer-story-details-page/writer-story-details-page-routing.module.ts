import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WriterStoryDetailsPageComponent } from "./writer-story-details-page.component";

const routes: Routes = [
  {
    path: '',
    component: WriterStoryDetailsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WriterStoryDetailsPageRoutingModule {}
