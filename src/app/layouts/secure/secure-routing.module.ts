import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureComponent } from './secure.component';
import { AppR } from '@shared/config/constants/routes';

const routes: Routes = [
  {
    path: '',
    component: SecureComponent,
    children: [
      {
        path: AppR.dashboard.simple,
        loadChildren: () =>
          import('@dashboard/dashboard-page.module').then(
            (m) => m.DashboardPageModule
          ),
        // loadChildren: () =>
        //   import('@auth/features/auth-shell/auth-shell.module').then(
        //     (m) => m.AuthShellModule
        //   ),
      },
      {
        path: AppR.profile.simple,
        loadChildren: () =>
          import('@profile/profile-page.module').then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: AppR.settings.simple,
        loadChildren: () =>
          import('@settings/settings-page.module').then(
            (m) => m.SettingsPageModule
          ),
      },
      {
        path: AppR.reader.stories.list.simple,
        loadChildren: () =>
          import(
            '@reader/features/reader-story-list-page/reader-story-list-page.module'
          ).then((m) => m.ReaderStoryListPageModule),
      },
      {
        path: AppR.writer.list.simple,
        loadChildren: () =>
          import(
            '@writer/features/writer-story-list-page/writer-story-list-page.module'
          ).then((m) => m.WriterStoryListPageModule),
      },
      {
        path: AppR.writer.create.simple,
        loadChildren: () =>
          import(
            '@writer/features/writer-story-create-page/writer-story-create-page.module'
          ).then((m) => m.WriterStoryCreatePageModule),
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecureRoutingModule {}
