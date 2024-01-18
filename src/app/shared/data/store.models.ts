import { Query, Store } from "@datorama/akita";
import { Error } from "app/models/Api";
import { Observable } from "rxjs";

export interface IBaseState {
  success: boolean;
  loading: boolean;
}

export class BaseStore<State extends IBaseState> extends Store<State> {
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

  onError(error: Error): void {
    this.setLoading(false);
    this.setError(error.fieldErrors);
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

export class BaseQuery<S extends IBaseState> extends Query<S> {
  protected constructor(store: BaseStore<S>) {
    super(store);
  }

  selectSuccess(): Observable<boolean> {
    return this.select((state) => state.success);
  }
}