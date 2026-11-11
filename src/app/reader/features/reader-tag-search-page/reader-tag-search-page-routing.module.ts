import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReaderTagSearchPageComponent } from "./reader-tag-search-page.component";

const routes: Routes = [
  {
    path: '',
    component: ReaderTagSearchPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReaderTagSearchPageRoutingModule {}
