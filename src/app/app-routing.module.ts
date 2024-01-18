import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from '@shared/config/guards/router.guards';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('@layouts/public/public.module').then((m) => m.PublicModule),
  //   canActivate: [isNotAuthenticatedGuard],
  // },
  {
    path: '',
    loadChildren: () =>
      import('@layouts/secure/secure.module').then((m) => m.SecureModule),
    // canActivate: [isAuthenticatedGuard],
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
