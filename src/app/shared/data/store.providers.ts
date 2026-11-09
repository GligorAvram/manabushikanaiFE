import { ENVIRONMENT_INITIALIZER, Provider } from "@angular/core";
import { devTools } from "@ngneat/elf-devtools";
import { storeActions$ } from "./store.actions";

export const storeProviders: Provider[] = [
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory() {
      return () => {
        devTools({ actionsDispatcher: storeActions$ });
      };
    },
  },
];
