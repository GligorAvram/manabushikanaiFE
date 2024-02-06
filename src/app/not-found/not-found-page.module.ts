import { NgModule } from '@angular/core';
import { NotFoundPageRoutingModule } from '@not-found/not-found-page-routing.module';
import { NotFoundPageComponent } from '@not-found/not-found-page.component';
import { ButtonModule } from '@shared/ui/buttons/button.module';
import { PrimaryButtonComponent } from '@shared/ui/buttons/primary-button.component';

@NgModule({
  imports: [
    NotFoundPageRoutingModule, 
    ButtonModule, 
    PrimaryButtonComponent
  ],
  declarations: [NotFoundPageComponent],
})
export class NotFoundPageModule {}
