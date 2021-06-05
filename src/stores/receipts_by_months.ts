import receipts_store, {Receipt, Date, ReceiptId} from './receipts';
import {writable, Writable, Readable} from 'svelte/store';
import {SparseArray, is_empty} from '../utils/collections';
import observe_add_and_remove, {ChangeKind, HasLastChange} from '../utils/store/observe_add_and_remove';
import {Subscriber} from '../utils/store/subscriber';

export type Month = {
    year: number,
    month: number,
};
export type MonthId = number & {};
export type DayNumber = number & {};

function get_month_id(month: Month): MonthId {
    return month.year * 100 + month.month;
}
export function get_month_from_id(id: MonthId): Month {
    return {year: Math.trunc(id / 100), month: id % 100};
}

export type DayGroup = SparseArray<ReceiptId, Receipt>;
export type MonthGroup = SparseArray<DayNumber, DayGroup>;
export type MonthGroupStore = Readable<MonthGroup> & HasLastChange<Receipt>;
type WritableMonthGroupStore = Writable<MonthGroup> & HasLastChange<Receipt>;
export type RootGroup = SparseArray<MonthId, MonthGroupStore>;
type PrivateRootGroup = SparseArray<MonthId, WritableMonthGroupStore>;

function create_store(): Readable<RootGroup> & {ready: Readable<boolean>} {
    let root_group: PrivateRootGroup = [];
    let store = {...writable(root_group), ready: receipts_store.ready};

    function add_receipt_into_month_group(month_group: MonthGroup, receipt: Receipt, day_number: DayNumber) {
        let day_group = (month_group[day_number] ||= []);
        day_group[receipt.id] = receipt;
    }
    function delete_receipt_from_month_group(month_group: MonthGroup, receipt_id: ReceiptId, day_number: DayNumber) {
        delete month_group[day_number][receipt_id];
        if (is_empty(month_group[day_number]))
            delete month_group[day_number];
    }

    type Task = (month_group: MonthGroup, month_group_store: MonthGroupStore) => void;
    type MonthTask = {month_id: MonthId, task: Task};
    let month_tasks: MonthTask[] = [];
    function add_month_task(month_id: MonthId, task: Task) {
        month_tasks.push({month_id, task});
    }

    // Groups `update`s of MonthGroupStore and adds/removes MonthGroupStore when it is needed
    function run_month_tasks() {
        let root_store_changed = false;
        for (let i = 0; i < month_tasks.length; i++) {
            let {month_id} = month_tasks[i];
            if (!root_group[month_id]) {
                root_group[month_id] = writable([]);
                root_store_changed = true;
            }
            let month_group_store = root_group[month_id];
            month_group_store.update(month_group => {
                while (true) {
                    month_tasks[i].task(month_group, month_group_store);
                    if (month_tasks[i + 1] && month_tasks[i + 1].month_id === month_id)
                        i++;
                    else
                        break;
                }

                if (is_empty(month_group)) {
                    delete root_group[month_id];
                    root_store_changed = true;
                }
                return month_group;
            });
        }
        if (root_store_changed)
            store.update(it => it);
        month_tasks.length = 0;
    }

    let subscriber = new Subscriber<Date>();
    observe_add_and_remove(receipts_store, {
        items_provider(receipts, on_each_receipt) {
            receipts.forEach(on_each_receipt);
        },
        on_add(receipt) {
            let location: Date | undefined;
            subscriber.subscribe(receipt.date, {
                start(date) {
                    add_month_task(get_month_id(date), (month_group, month_group_store) => {
                        add_receipt_into_month_group(month_group, receipt, date.day);
                        if (location && get_month_id(location) === get_month_id(date))
                            month_group_store.last_change = undefined;
                        else
                            month_group_store.last_change = {kind: ChangeKind.ITEM_ADDED, item: receipt};
                        location = date;
                    });
                },
                clean_up() {
                    let location_copy = location!; // Just extra guarantee of synchronization
                    add_month_task(get_month_id(location_copy), (month_group, month_group_store) => {
                        delete_receipt_from_month_group(month_group, receipt.id, location_copy.day);
                        month_group_store.last_change = {kind: ChangeKind.ITEM_REMOVED, item: receipt};
                    });
                },
                apply() {
                    run_month_tasks();
                },
            });
        },
        on_remove(receipt) {
            subscriber.unsubscribe(receipt.date);
        },
    });

    return store;
}
export default create_store();
