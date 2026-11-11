import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReaderCollectionListPageComponent } from "./reader-collection-list-page.component";

const routes: Routes = [
  {
    path: '',
    component: ReaderCollectionListPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReaderCollectionListPageRoutingModule {}
