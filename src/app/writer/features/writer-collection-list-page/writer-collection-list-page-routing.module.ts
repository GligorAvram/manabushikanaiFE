import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WriterCollectionListPageComponent } from "./writer-collection-list-page.component";

const routes: Routes = [
  {
    path: '',
    component: WriterCollectionListPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WriterCollectionListPageRoutingModule {}
