import {Query} from "@datorama/akita";
import {BaseState} from "./base.state";
import {BaseStore} from "./store.models";
import {Observable, of} from "rxjs";


export class BaseQuery<S extends BaseState> extends Query<S> {
  protected constructor(store: BaseStore<S>) {
    super(store);
  }

  selectSuccess(): Observable<boolean> {
    return of(true);
  }
}
