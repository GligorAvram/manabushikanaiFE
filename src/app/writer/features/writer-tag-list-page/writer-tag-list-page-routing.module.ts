import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WriterTagListPageComponent } from "./writer-tag-list-page.component";

const routes: Routes = [
  {
    path: '',
    component: WriterTagListPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WriterTagListPageRoutingModule {}
