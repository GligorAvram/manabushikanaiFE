import {SelectInputOptions} from "@shared/ui/input/select-input.component";
import {DictionaryWordDto} from "@models/Api";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({ name: "possibleTranslationToInputOptions", pure: true })
export class PossibleTranslationToInputOptions implements PipeTransform {
  transform(value: DictionaryWordDto[]): SelectInputOptions {
    //todo check the ? in the dto
    return value.map(data => {return {id: data.id ?? "", name: data.dictionaryForm ?? "", discriminator: "ISelectInputOption"}})
  }
}
