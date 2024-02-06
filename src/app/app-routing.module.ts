import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@layouts/secure/secure.module').then((m) => m.SecureModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('@not-found/not-found-page.module').then(
        (m) => m.NotFoundPageModule
      ),
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
