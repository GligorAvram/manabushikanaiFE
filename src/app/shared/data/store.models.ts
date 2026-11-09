import { Store } from '@datorama/akita';
import { HttpErrorDto } from '@models/Api';
import { BaseState } from './base.state';

export class BaseStore<State extends BaseState> extends Store<State> {
  private resetTimer?: ReturnType<typeof setTimeout>;

  onRequestInit(): void {
    this.clearResetTimer();
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

    onError(error: HttpErrorDto): void {
    this.setLoading(false);
    this.setError(error);
  }

  setSuccess(value: boolean): void {
    this.update({ ...this.getValue(), success: value });
  }

  resetBaseState(): void {
    this.resetTimer = undefined;
    this.update((state) => ({
      ...state,
      loading: false,
      success: false,
      error: null,
    }));
  }

  scheduleReset(delay: number = 200): void {
    this.clearResetTimer();
    this.resetTimer = setTimeout(() => this.resetBaseState(), delay);
  }

  private clearResetTimer(): void {
    if (this.resetTimer !== undefined) {
      clearTimeout(this.resetTimer);
      this.resetTimer = undefined;
    }
  }
}
