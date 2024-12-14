import {NgModule} from "@angular/core";
import {StoryNamePipe} from "./story-name.pipe";
import {StoryDifficultyPipe} from "./story-difficulty.pipe";

const Pipes = [
    StoryNamePipe,
    StoryDifficultyPipe
];

@NgModule({
  declarations: Pipes,
  exports: Pipes,
})
export class WriterPipesModule {}
