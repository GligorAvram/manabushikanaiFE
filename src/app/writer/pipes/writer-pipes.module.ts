import { NgModule } from '@angular/core';
import { PossibleTranslationToInputOptions } from '@writer/pipes/possible-translations-to-input-options.pipe';
import { StoryDifficultyPipe } from './story-difficulty.pipe';
import { StoryNamePipe } from './story-name.pipe';

const Pipes = [
    StoryNamePipe,
    StoryDifficultyPipe,
    PossibleTranslationToInputOptions
];

@NgModule( {
               declarations: Pipes,
               exports     : Pipes
           } )
export class WriterPipesModule {
}
