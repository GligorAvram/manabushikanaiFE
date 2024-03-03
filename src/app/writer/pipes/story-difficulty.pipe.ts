import { Pipe, PipeTransform } from "@angular/core";
import { StoryDto } from "app/models/Api";

@Pipe({ name: 'storyDifficulty', pure: true })
export class StoryDifficultyPipe implements PipeTransform {
  transform(value: StoryDto): number {
    return value.difficulty!;
  }
}
