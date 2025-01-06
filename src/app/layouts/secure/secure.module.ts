import { NgModule } from '@angular/core';
import { SideMenuComponent } from '@shared/ui/side-menu.component';
import { TopBarComponent } from '@shared/ui/top-bar.component';
import { SecureRoutingModule } from './secure-routing.module';
import { SecureComponent } from './secure.component';

@NgModule( {
               declarations: [ SecureComponent ],
               imports     : [ SecureRoutingModule, TopBarComponent, SideMenuComponent ]
           } )
export class SecureModule {
}
