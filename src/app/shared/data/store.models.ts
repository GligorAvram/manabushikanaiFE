import { Store } from '@datorama/akita';
import { Error, HttpErrorDto } from '@models/Api';
import { BaseState } from './base.state';

export class BaseStore<State extends BaseState> extends Store<State> {
  onRequestInit(): void {
    this.update((state) => ({
      ...state,
      loading: true,
      success: false,
      error: null,
    }));
  }

  onSuccess(fromGETRequest: boolean): void {
    this.setLoading(false);

    if (!fromGETRequest) {
      this.setSuccess(true);
    }
  }

    onError(error: HttpErrorDto | Error): void {
    this.setLoading(false);
    this.setError(error);
  }

  setSuccess(value: boolean): void {
    this.update({ ...this.getValue(), success: value });
  }

  resetBaseState(): void {
    this.update((state) => ({
      ...state,
      loading: false,
      success: false,
      error: null,
    }));
  }
}
