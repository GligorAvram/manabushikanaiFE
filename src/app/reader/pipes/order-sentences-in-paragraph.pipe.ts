import { Pipe, PipeTransform } from '@angular/core';
import { SentenceDto } from '@models/Api';

@Pipe( { name: 'orderSentences', pure: true, standalone: true } )
export class OrderSentencesInParagraphPipe implements PipeTransform {
    transform(value: SentenceDto[]): SentenceDto[] {
        // needs slicing because the array is frozen in strict mode
        return value.slice()
                    .sort( (s1, s2) => s1.order - s2.order );
    }
}
