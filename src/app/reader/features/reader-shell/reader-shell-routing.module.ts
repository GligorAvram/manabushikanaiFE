import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppR } from "@shared/config/constants/routes";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import(
        '@reader/features/reader-story-list-page/reader-story-list-page.module'
      ).then((m) => m.ReaderStoryListPageModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReaderShellRoutingModule {}
