import { MatDividerModule } from "@angular/material/divider";
import { DashboardPageRoutingModule } from "./dashboard-page-routing.module";
import { DashboardPageComponent } from "./dashboard-page.component";
import { NgModule } from "@angular/core";

@NgModule({
  imports: [
    DashboardPageRoutingModule,
    MatDividerModule,
  ],
  declarations: [DashboardPageComponent],
})
export class DashboardPageModule {}
