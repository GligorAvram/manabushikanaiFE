import { storeActions$ } from './store.actions';

function withAction(name: string): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
        const originalMethod = descriptor.value;

        descriptor.value = function (this: unknown, ...args: any[]): unknown {
            storeActions$.next({ type: name });
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

/** Labels a store mutation method for the devtools timeline. */
export function storeEvent(name: string): MethodDecorator {
    return withAction(name);
}

/** Labels an actions-service method for the devtools timeline. */
export function action(name: string): MethodDecorator {
    return withAction(name);
}
