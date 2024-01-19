import { Pipe, PipeTransform } from "@angular/core";
import { StoryDto } from "app/models/Api";

@Pipe({ name: 'storyName', pure: true })
export class StoryNamePipe implements PipeTransform {
  transform(value: StoryDto): string {
    return value.name;
  }
}
