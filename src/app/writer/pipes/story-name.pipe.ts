import { Pipe, PipeTransform } from '@angular/core';
import { StoryDto } from 'app/models/Api';

@Pipe( { name: 'storyName', standalone: false, pure: true } )
export class StoryNamePipe implements PipeTransform {
    transform(value: StoryDto): string {
        return value.name!;
    }
}
