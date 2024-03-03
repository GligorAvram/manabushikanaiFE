import { Store } from "@datorama/akita";
import { BaseEntityState, BaseState } from "./base.state";

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

  onError(error: Error): void {
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

export class BaseEntityStore<Entity, State extends BaseEntityState<Entity>> extends Store<State> {
    onRequestInit(): void {
        this.update( state => (
            { ...state, loading: true, success: false, error: null }
        ) );
    }

    onSuccess(fromGETRequest: boolean): void {
        this.setLoading( false );

        if( !fromGETRequest ) {
            this.setSuccess( true );
        }
    }

    onError(error: Error): void {
        this.setLoading( false );
        this.setError( error );
    }

    setSuccess(value: boolean): void {
        this.update( state => (
            { ...state, success: value }
        ) );
    }

    resetBaseState(): void {
        this.update( state => (
            { ...state, loading: false, success: false, error: null }
        ) );
    }

    clearEntities(): void {
        this.update(state => ({...state, entities: []} ));
    }

    clearActive(): void {
        this.update( state => ({ ...state, active: null } ));
    }
}