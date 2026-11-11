import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WriterCollectionDetailsPageComponent } from "./writer-collection-details-page.component";

const routes: Routes = [
  {
    path: '',
    component: WriterCollectionDetailsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WriterCollectionDetailsPageRoutingModule {}
