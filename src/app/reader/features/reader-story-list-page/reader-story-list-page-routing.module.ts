import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReaderStoryListPageComponent } from "./reader-story-list-page.component";

const routes: Routes = [
  {
    path: '',
    component: ReaderStoryListPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReaderStoryListPageRoutingModule {}
