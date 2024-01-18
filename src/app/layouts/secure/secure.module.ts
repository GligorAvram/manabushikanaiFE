import { NgModule } from '@angular/core';
import { TopBarComponent } from "@shared/ui/top-bar.component";
import { SideMenuComponent } from "@shared/ui/side-menu.component";
import { SecureComponent } from './secure.component';
import { SecureRoutingModule } from './secure-routing.module';

@NgModule({
    declarations: [SecureComponent],
    imports: [SecureRoutingModule, TopBarComponent, SideMenuComponent]
})
export class SecureModule {}
