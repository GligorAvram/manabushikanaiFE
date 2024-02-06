import { NgModule } from "@angular/core";
import { ButtonDirective } from "./button.directive";
import { BackButtonDirective } from "./back-button.directive";

@NgModule({
  declarations: [ButtonDirective, BackButtonDirective],
  exports: [ButtonDirective, BackButtonDirective],
})
export class ButtonModule {}
