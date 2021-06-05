import type {Readable, Unsubscriber} from 'svelte/store';

export type Handlers<V> = {
    start: (value: V) => void,
    clean_up: () => void,
    apply: () => void,
};

export class Subscriber<V> {
    private unsubscribers = new Map<Readable<V>, Unsubscriber>();

    constructor() {     
    }

    // TODO? add 'key' as argument
    subscribe(store: Readable<V>, handlers: Handlers<V>) {
        let inited = false;
        let store_unsubscriber = store.subscribe(new_value => {
            if (inited)
                handlers.clean_up();
            handlers.start(new_value);
            handlers.apply();
        });
        inited = true;
        let unsubscriber = () => {
            handlers.clean_up();
            handlers.apply();
            store_unsubscriber();
        };
        this.unsubscribers.set(store, unsubscriber);
    }

    unsubscribe(store: Readable<V>) {
        this.unsubscribers.get(store)!();
        this.unsubscribers.delete(store);
    }

    unsubscribe_all() {
        for (let unsubscriber of this.unsubscribers.values())
            unsubscriber();
        this.unsubscribers.clear();
    }
}
