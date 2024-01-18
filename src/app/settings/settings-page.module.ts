import { MatDividerModule } from "@angular/material/divider";
import { NgModule } from "@angular/core";
import { SettingsPageRoutingModule } from "./settings-page-routing.module";
import { SettingsPageComponent } from "./settings-page.component";

@NgModule({
  imports: [
    SettingsPageRoutingModule,
    MatDividerModule,
  ],
  declarations: [SettingsPageComponent],
})
export class SettingsPageModule {}
