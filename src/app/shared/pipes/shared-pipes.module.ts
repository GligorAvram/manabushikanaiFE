import { NgModule } from "@angular/core";
import { EnumToSelectInputOptionsPipe } from "./enum-to-select-input-options.pipe";

const Pipes = [
    EnumToSelectInputOptionsPipe
]

@NgModule({
  declarations: Pipes,
  exports: Pipes,
})
export class SharedPipesModule {}
