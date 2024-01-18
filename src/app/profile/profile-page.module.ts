import { MatDividerModule } from "@angular/material/divider";
import { NgModule } from "@angular/core";
import { ProfilePageComponent } from "./profile-page.component";
import { ProfilePageRoutingModule } from "./profile-page-routing.module";

@NgModule({
  imports: [
    ProfilePageRoutingModule,
    MatDividerModule,
  ],
  declarations: [ProfilePageComponent],
})
export class ProfilePageModule {}
