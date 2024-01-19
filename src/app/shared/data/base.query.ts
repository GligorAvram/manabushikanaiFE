import { Query } from "@datorama/akita";
import { BaseEntityState, BaseState } from "./base.state";
import { BaseEntityStore, BaseStore } from "./store.models";
import { Observable, of } from "rxjs";
import { Error } from "app/models/Api";


export class BaseQuery<S extends BaseState> extends Query<S> {
  protected constructor(store: BaseStore<S>) {
    super(store);
  }

  selectSuccess(): Observable<boolean> {
    return of(true);
  }
}

export class BaseEntityQuery<Entity, State extends BaseEntityState<Entity> > extends Query<State> {
  protected constructor(store: BaseEntityStore<Entity, State>) {
    super(store);
  }

  selectSuccess(): Observable<boolean> {
    return this.select((state) => state.success);
  }

  selectErrors(): Observable<Error[]> {
    return this.selectError<Error[]>();
  }
}