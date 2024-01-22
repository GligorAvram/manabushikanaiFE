import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppR } from '@shared/config/constants/routes';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import(
        '@writer/features/writer-story-list-page/writer-story-list-page.module'
      ).then((m) => m.WriterStoryListPageModule),
  },
  {
    path: AppR.writer.details.simple,
    loadChildren: () =>
      import(
        '@writer/features/writer-story-details-page/writer-story-details-page.module'
      ).then((m) => m.WriterStoryDetailsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WriterShellRoutingModule {}
