import { NgModule } from '@angular/core';
import { PublicRoutingModule } from '@layouts/public/public-routing.module';
import { PublicComponent } from '@layouts/public/public.component';
import { TopBarComponent } from "@shared/ui/top-bar.component";
import { SideMenuComponent } from "@shared/ui/side-menu.component";

@NgModule({
    declarations: [PublicComponent],
    imports: [PublicRoutingModule, TopBarComponent, SideMenuComponent]
})
export class PublicModule {}
