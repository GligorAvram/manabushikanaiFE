import { valueIsDefined, valueIsEmpty, valueIsNotEmpty } from "@shared/functions";
import { Error } from "app/models/Api";

export class ApiResult<T> {
  readonly data?: T | null;
  readonly error?: Error;

  constructor(payload: { data?: T; error?: Error }) {
    this.data = valueIsEmpty(payload.error) ? payload.data : null;
    this.error = payload.error;
  }

  isFailed(): boolean {
    return !valueIsNotEmpty(this.error);
  }

  isSuccessful(): boolean {
    return !this.isFailed() && valueIsDefined(this.data);
  }
}
