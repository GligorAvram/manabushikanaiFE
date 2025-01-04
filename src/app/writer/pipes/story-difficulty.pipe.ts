import {Pipe, PipeTransform} from "@angular/core";
import {StoryDifficultyEnum, StoryDto} from "app/models/Api";

@Pipe({ name: 'storyDifficulty', pure: true })
export class StoryDifficultyPipe implements PipeTransform {
  transform(value: StoryDto): StoryDifficultyEnum {
    return value.difficulty!;
  }
}
