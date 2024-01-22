import { isArray, isBoolean, isEmpty, isFunction, isNil, isString } from "lodash-es";

export const valueIsDefined = <T>(
  input: null | undefined | T,
): input is NonNullable<T> => input !== null && input !== undefined;

export const valueIsString = (value: any): value is string =>
  valueIsDefined(value) && isString(value);

export const valueIsNumber = (value: any): value is number =>
  valueIsDefined(value) && Number.isFinite(value);

export const valueIsBoolean = (value: any): value is boolean =>
  (valueIsDefined(value) && isBoolean(value)) ||
  value === 'true' ||
  value === 'false';

export const valueIsObject = (value: any): value is object =>
  valueIsDefined(value) && typeof value === 'object';

export const valueIsArray = <T = any>(value: any): value is Array<T> =>
  valueIsDefined(value) && isArray(value);

export function valueIsNotEmpty<T>(
  value:
    | Object
    | string
    | number
    | null
    | undefined
    | T
    | ((...args: any) => any),
): value is NonNullable<T> {
  if (value === null || value === undefined) {
    return false;
  }

  if (value instanceof Date) {
    return true;
  }

  if (isBoolean(value)) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (isArray(value)) {
    return value.length > 0;
  }

  if (value instanceof Blob) {
    return true;
  }

  return !isNil(value) && !isEmpty(value);
}

export function valueIsEmpty(
  value:
    | Object
    | string
    | number
    | boolean
    | null
    | undefined
    // | ((...args: any) => any),
): value is undefined | null {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return isNil(value);
  }

  if (value instanceof Date) {
    return false;
  }

  if (isArray(value)) {
    return value.length === 0;
  }

  if (isFunction(value)) {
    return value === null || value === undefined;
  }

  return isNil(value) || isEmpty(value);
}