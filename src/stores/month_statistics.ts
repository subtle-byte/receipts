import {readable, Readable} from 'svelte/store';
import type {CategoryId} from './categories';
import type {Item, Money} from '../stores/receipts';
import type {MonthGroupStore} from './receipts_by_months';
import observe_add_and_remove from '../utils/store/observe_add_and_remove';
import {Subscriber} from '../utils/store/subscriber';
import {get_items_merged_by_categories_store} from './items_merged_by_categories';

export type MonthStatistics = {
    price: Money,
    by_categories: Map<CategoryId, Money>,
    max_category_price: Money,
};
function update_statistics(statistics: MonthStatistics, items: Item[], factor: 1 | -1) {
    for (let {category_id, price} of items) {
        let category_price = (statistics.by_categories.get(category_id) || 0) + factor * price;
        statistics.by_categories.set(category_id, category_price);
        statistics.price += factor * price;
    }
    statistics.max_category_price = 0;
    for (let [category, price] of statistics.by_categories) {
        if (price === 0)
            statistics.by_categories.delete(category);
        else if (statistics.max_category_price < price)
            statistics.max_category_price = price;
    }
}

let statistics_stores = new WeakMap<MonthGroupStore, Readable<MonthStatistics>>();

export function get_month_statistics_store(month_store: MonthGroupStore): Readable<MonthStatistics> {
    let result_store = statistics_stores.get(month_store);
    if (result_store)
        return result_store;

    result_store = readable(undefined as any, set => {
        let statistics: MonthStatistics = {
            price: 0,
            by_categories: new Map(),
            max_category_price: 0,
        };
        set(statistics);

        let subscriber = new Subscriber<Item[]>();
        let end_observation = observe_add_and_remove(month_store, {
            items_provider(month_group, on_each_item) {
                month_group.forEach(day_group => day_group.forEach(on_each_item));
            },
            on_add(receipt) {
                let added_items: Item[] | undefined;
                subscriber.subscribe(get_items_merged_by_categories_store(receipt.items), {
                    start(items) {
                        update_statistics(statistics, items, 1);
                        added_items = [...items.map(item => ({...item}))];
                    },
                    clean_up() {
                        update_statistics(statistics, added_items!, -1);
                        added_items = undefined;
                    },
                    apply() {
                        set(statistics);
                    },
                });
            },
            on_remove(receipt) {
                subscriber.unsubscribe(get_items_merged_by_categories_store(receipt.items));
            },
        });

        return () => {
            subscriber.unsubscribe_all();
            end_observation();
            set(undefined);
        };
    });
    statistics_stores.set(month_store, result_store);
    return result_store;
}
