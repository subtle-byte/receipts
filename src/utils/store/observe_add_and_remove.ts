import type {Readable, Unsubscriber} from 'svelte/store';

export enum ChangeKind {
    ITEM_ADDED,
    ITEM_REMOVED,
}
export type Change<I> = {
    kind: ChangeKind,
    item: I,
}

export interface HasLastChange<I> {
    last_change?: Change<I>,
}

export default function <C, I>(
    target: Readable<C> & HasLastChange<I>,
    {items_provider, on_add, on_remove} : {
        on_add: (item: I) => void,
        on_remove: (item: I) => void,
        items_provider: (collection: C, on_each_item: (item: I) => void) => void,
    },
): Unsubscriber {
    let inited = false;

    let unsubscribe_from_target = target.subscribe((collection: C) => {
        if (!inited) {
            items_provider(collection, (item: I) => on_add(item));
            inited = true;
        }
        else if (target.last_change) {
            let {kind: change_kind, item} = target.last_change;
            if (change_kind === ChangeKind.ITEM_ADDED)
                on_add(item);
            else if (change_kind === ChangeKind.ITEM_REMOVED)
                on_remove(item);
        }
    });

    return unsubscribe_from_target;
}
