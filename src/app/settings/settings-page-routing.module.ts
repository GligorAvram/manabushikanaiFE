import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from '@dashboard/dashboard-page.component';
import { SettingsPageComponent } from './settings-page.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
