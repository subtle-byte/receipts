import observe_add_and_remove from '../utils/store/observe_add_and_remove';
import {Subscriber} from '../utils/store/subscriber';
import receipts_store, {Item} from './receipts';
import type {CategoryId} from './categories';
import {readable} from 'svelte/store';

export type Counter = number & {};
let used_categories = new Map<CategoryId, Counter>();
function add_category_usage(category_id: CategoryId) {
    let counter = used_categories.get(category_id);
    used_categories.set(category_id, (counter || 0) + 1);
}
function delete_category_usage(category_id: CategoryId) {
    let counter = used_categories.get(category_id);
    if (counter) {
        if (counter > 1)
            used_categories.set(category_id, counter - 1);
        else
            used_categories.delete(category_id);
    }
}

export default readable(used_categories, (set) => {
    let subscriber = new Subscriber<Item[]>();
    let end_observe = observe_add_and_remove(receipts_store, {
        items_provider(receipts, on_each_receipt) {
            receipts.forEach(on_each_receipt);
        },
        on_add(receipt) {
            let added_items: Item[] | undefined;
            subscriber.subscribe(receipt.items, {
                start(items) {
                    for (let item of items)
                        add_category_usage(item.category_id);
                    added_items = [...items.map(item => ({...item}))];
                },
                clean_up() {
                    for (let item of added_items!)
                        delete_category_usage(item.category_id);
                    added_items = undefined;
                },
                apply() {
                    set(used_categories);
                }
            });
        },
        on_remove(receipt) {
            subscriber.unsubscribe(receipt.items);
        },
    });

    return () => {
        end_observe();
        subscriber.unsubscribe_all();
        used_categories.clear();
    };
});
