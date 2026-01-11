import { Pipe, PipeTransform } from '@angular/core';
import { DictionaryWordDto } from '@models/Api';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';

@Pipe( { name: 'possibleTranslationToInputOptions', standalone: false, pure: true } )
export class PossibleTranslationToInputOptions implements PipeTransform {
    transform(value: DictionaryWordDto[]): SelectInputOptions {
        //todo check the ? in the dto
        return value.map( data => {
            return { id: data.id ?? '', name: data.dictionaryForm ?? '', discriminator: 'ISelectInputOption' };
        } );
    }
}
