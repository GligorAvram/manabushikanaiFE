import { Pipe, PipeTransform } from "@angular/core";
import { valueIsNotEmpty } from "@shared/functions";
import { SelectInputOptions } from "@shared/ui/input/select-input.component";
import { startCase } from "lodash-es";

@Pipe({ name: 'enumToSelectInputOptions', pure: true })
export class EnumToSelectInputOptionsPipe implements PipeTransform {
  transform<T>(
    value: T,
    // @ts-ignore
    descriptions?: { [key in T]: string },
  ): SelectInputOptions {
    // @ts-ignore
    return Object.values(value).map((enumValue) => ({
      id: enumValue,
      name:
        typeof enumValue === 'string'
          ? startCase(enumValue.replace('_', ' '))
          : enumValue,
      description: valueIsNotEmpty(descriptions)
        ? // @ts-ignore
          descriptions[enumValue]
        : '',
      discriminator: 'ISelectInputOption',
    }));
  }
}

