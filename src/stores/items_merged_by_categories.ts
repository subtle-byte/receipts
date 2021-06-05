import {derived, Readable} from 'svelte/store';
import type {CategoryId} from './categories';
import type {Item} from '../receipts_db';

let merged_items_stores = new WeakMap<Readable<Item[]>, Readable<Item[]>>();

function merge_items(items: Item[]): Item[] {
    let merged_items = new Map<CategoryId, Item>();

    for (let {category_id, price} of items) {
        if (!merged_items.has(category_id))
            merged_items.set(category_id, {category_id, price: 0});
        merged_items.get(category_id)!.price += price;
    }

    return [...merged_items.values()];
}

export function get_items_merged_by_categories_store (items_store: Readable<Item[]>): Readable<Item[]> {
    let result_store = merged_items_stores.get(items_store);
    if (!result_store) {
        result_store = derived(items_store, merge_items);
        merged_items_stores.set(items_store, result_store);
    }
    return result_store;
}
