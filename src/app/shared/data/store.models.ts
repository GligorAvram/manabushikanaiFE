import { createStore, select, Store, withProps } from '@ngneat/elf';
import { persistState, sessionStorageStrategy } from '@ngneat/elf-persist-state';
import { HttpErrorDto } from '@models/Api';
import { Observable } from 'rxjs';
import { BaseState } from './base.state';

type StateUpdater<State> = Partial<State> | ((state: State) => Partial<State>);

export abstract class BaseStore<State extends BaseState> {
  private readonly store: Store<{ name: string; state: State; config: any }>;
  private resetTimer?: ReturnType<typeof setTimeout>;

  protected constructor(name: string, initialState: State) {
    this.store = createStore({ name }, withProps<State>(initialState));
    persistState(this.store, { key: name, storage: sessionStorageStrategy });
  }

  getValue(): State {
    return this.store.getValue();
  }

  select<R>(selector: (state: State) => R): Observable<R> {
    return this.store.pipe(select(selector));
  }

  update(updater: StateUpdater<State>): void {
    this.store.update((state) => ({
      ...state,
      ...(typeof updater === 'function' ? updater(state) : updater),
    }));
  }

  setLoading(loading: boolean): void {
    this.update({ loading } as Partial<State>);
  }

  setError(error: HttpErrorDto | null): void {
    this.update({ error } as Partial<State>);
  }

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
    this.update({ success: value } as Partial<State>);
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
