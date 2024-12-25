import {NgModule} from "@angular/core";
import {WriterStoryDetailsPageRoutingModule} from "./writer-story-details-page-routing.module";
import {CommonModule} from "@angular/common";
import {LoadingBarComponent} from "@shared/ui/loading-bar.component";
import {WriterDataModule} from "@writer/data/writer-data.module";
import {ButtonModule} from "@shared/ui/buttons/button.module";
import {MatCard} from "@angular/material/card";
import {MatStep, MatStepper} from "@angular/material/stepper";
import {PrimaryButtonComponent} from "@shared/ui/buttons/primary-button.component";
import {SentenceEditorComponent} from "@writer/ui/sentence-editor.component";
import {SliderComponent} from "@shared/ui/slider.component";
import {WordEditorComponent} from "@writer/ui/word-editor.component";
import {
  WriterStoryDetailsPageComponent
} from "@writer/features/writer-story-details-page/writer-story-details-page.component";
import {AddWordToDictionaryFormModalComponent} from "@writer/ui/add-word-to-dictionary-form-modal.component";
import {ContainerComponent} from "@shared/ui/container.component";

@NgModule({
  declarations: [WriterStoryDetailsPageComponent],
  imports: [
    CommonModule,
    WriterStoryDetailsPageRoutingModule,
    LoadingBarComponent,
    WriterDataModule,
    ButtonModule,
    MatCard,
    MatStep,
    MatStepper,
    PrimaryButtonComponent,
    SentenceEditorComponent,
    SliderComponent,
    WordEditorComponent,
    AddWordToDictionaryFormModalComponent,
    ContainerComponent
  ]
})
export class WriterStoryDetailsPageModule {}
