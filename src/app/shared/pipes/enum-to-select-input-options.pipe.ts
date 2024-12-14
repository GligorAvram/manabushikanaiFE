import {Pipe, PipeTransform} from "@angular/core";
import {ISelectInputOption, SelectInputOptions} from "@shared/ui/input/select-input.component";
import {FormControl} from "@angular/forms";

@Pipe({ name: 'enumToSelectInputOptions', pure: true })
export class EnumToSelectInputOptionsPipe implements PipeTransform {
  transform<T extends Record<string, string | number>>(
    value: T,
    descriptions?: { [key in keyof T]?: string }
  ): FormControl<SelectInputOptions> {
    // @ts-ignore
    // TODO the types are really messed up
    const options: SelectInputOptions = Object.entries(value)
      .filter(([key, enumValue]) => typeof enumValue === 'string' || typeof enumValue === 'number')
      .map(([key, enumValue]) => ({
        id: enumValue,
        name: typeof enumValue === 'string' ? this.formatEnumValue(enumValue) : `${enumValue}`,
        description: descriptions?.[key] || '',
        discriminator: 'ISelectInputOption',
      }));

    console.log(options)

    return new FormControl(options, {nonNullable: true});
  }

  private formatEnumValue(value: string): string {
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

