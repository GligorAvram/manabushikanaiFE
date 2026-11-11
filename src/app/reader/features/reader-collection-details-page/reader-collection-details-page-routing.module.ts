import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReaderCollectionDetailsPageComponent } from "./reader-collection-details-page.component";

const routes: Routes = [
  {
    path: '',
    component: ReaderCollectionDetailsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReaderCollectionDetailsPageRoutingModule {}
