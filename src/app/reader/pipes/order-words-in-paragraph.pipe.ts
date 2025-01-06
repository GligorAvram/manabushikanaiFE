import { Pipe, PipeTransform } from '@angular/core';
import { WordDto } from '@models/Api';

@Pipe( { name: 'orderWords', pure: true, standalone: true } )
export class OrderWordsInParagraphPipe implements PipeTransform {
    transform(value: WordDto[]): WordDto[] {
        // needs slicing because the array is frozen in strict mode
        return value.slice()
                    .sort( (w1, w2) => w1.order - w2.order );
    }
}
