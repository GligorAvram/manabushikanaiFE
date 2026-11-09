import { Observable } from "rxjs";
import { BaseState } from "./base.state";
import { BaseStore } from "./store.models";


export class BaseQuery<S extends BaseState> {
  protected constructor(private readonly store: BaseStore<S>) {
  }

  select<R>(selector: (state: S) => R): Observable<R> {
    return this.store.select(selector);
  }

  selectLoading(): Observable<boolean> {
    return this.store.select((state) => state.loading);
  }

  selectSuccess(): Observable<boolean> {
    return this.store.select((state) => state.success);
  }
}
