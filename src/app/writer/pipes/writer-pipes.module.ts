import { NgModule } from "@angular/core";
import { StoryNamePipe } from "./story-name.pipe";
import { StoryDifficultyPipe } from "./story-difficulty.pipe";
import { PossibleTranslationToInputOptions } from "./possible-translations-to-input-options.pipe";

const Pipes = [StoryNamePipe, StoryDifficultyPipe, PossibleTranslationToInputOptions];

@NgModule({
  declarations: Pipes,
  exports: Pipes,
})
export class WriterPipesModule {}
