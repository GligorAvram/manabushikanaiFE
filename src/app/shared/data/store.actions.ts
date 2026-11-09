import { Subject } from 'rxjs';

/**
 * Stream of store action names, consumed by Elf devtools (`actionsDispatcher`)
 * to label the state update that each decorated store/action method triggers.
 */
export const storeActions$ = new Subject<{ type: string }>();
