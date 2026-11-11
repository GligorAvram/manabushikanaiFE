import { Observable } from "rxjs";
import { BaseState } from "./base.state";
import { BaseStore } from "./store.models";


export class BaseQuery<S extends BaseState> {
  protected constructor(private readonly store: BaseStore<S>) {
  }

  select<R>(selector: (state: S) => R): Observable<R> {
    return this.store.select(selector);
  }

  /**
   * Defensive: persisted/restored sessionStorage state can hold a non-array value for a
   * slice (shape drift across versions/instances). `?? []` only catches null/undefined, so
   * a non-array object reaches `mat-table` and throws NG0900. Always read list slices
   * through this. See docs/shared/state.md.
   */
  protected asArray<T>(value: unknown): T[] {
    return Array.isArray(value) ? (value as T[]) : [];
  }

  selectLoading(): Observable<boolean> {
    return this.store.select((state) => state.loading);
  }

  selectSuccess(): Observable<boolean> {
    return this.store.select((state) => state.success);
  }
}
