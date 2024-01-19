import { Provider, ENVIRONMENT_INITIALIZER, inject, NgZone } from "@angular/core";
import { persistState, akitaDevtools } from "@datorama/akita";
import { PERSIST_STORAGE, Stores } from "./store.constants";

export const storeProviders: Provider[] = [
  {
    provide: PERSIST_STORAGE,
    useValue: persistState({
      storage: sessionStorage,
      include: Stores,
    }),
  },
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory() {
      return () => {
        akitaDevtools(inject(NgZone));
      };
    },
  },
];
