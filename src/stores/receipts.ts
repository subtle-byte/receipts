import * as db from '../receipts_db';
import type {Item, ReceiptId} from '../receipts_db';
export type {Item, ReceiptId, Money} from '../receipts_db';
import {Readable, writable, Writable} from 'svelte/store';
import type {SparseArray} from '../utils/collections';
import {Change, ChangeKind} from '../utils/store/observe_add_and_remove';

export type Date = {
    year: number,
    month: number,
    day: number,
};
export type Receipt = {
    id: ReceiptId,
    date: Writable<Date>,
    items: Writable<Item[]>
};

function construct_receipt(id: ReceiptId, date: Date, items: Item[]): Receipt {
    let receipt = {
        id,
        date: writable({...date}),
        items: writable([...items]),
    };
    receipt.date.subscribe(date => db.update_receipt(id, {...date}));
    receipt.items.subscribe(items => db.update_receipt(id, {items}));
    return receipt;
}

let {subscribe, update} = writable([] as SparseArray<ReceiptId, Receipt>);
function add_receipt_into_store(id: ReceiptId, date: Date, items: Item[]) {
    let receipt = construct_receipt(id, date, items);
    update(receipts => {
        store.last_change = {kind: ChangeKind.ITEM_ADDED, item: receipt};
        receipts[id] = receipt;
        return receipts;
    });
}
function delete_receipt_from_store(id: ReceiptId) {
    update(receipts => {
        store.last_change = {kind: ChangeKind.ITEM_REMOVED, item: receipts[id]};
        delete receipts[id];
        return receipts;
    });
}

// TODO? Create db.get_all_receipts by making PlainReceipt to hold `id`
db.get_all_receipt_ids(receipt_ids => {
    if (receipt_ids.length === 0) {
        ready.set(true);
        return;
    }
    let loaded = 0;
    for (let receipt_id of receipt_ids) {
        db.get_receipt(receipt_id, plain_receipt => {
            let date = {
                day: plain_receipt.day,
                month: plain_receipt.month,
                year: plain_receipt.year,
            };
            add_receipt_into_store(receipt_id, date, plain_receipt.items);

            loaded += 1;
            if (loaded === receipt_ids.length)
                ready.set(true);
        });
    }
});

let ready = writable(false);
let store = {
    subscribe,
    add_receipt(date: Date, items: Item[], id?: ReceiptId) {
        db.add_receipt({...date, items}, receipt_id => {
            add_receipt_into_store(receipt_id, date, items);
        }, id);
    },
    delete_receipt(id: ReceiptId) {
        db.delete_receipt(id);
        delete_receipt_from_store(id);
    },
    last_change: undefined as undefined | Change<Receipt>,
    ready: ready as Readable<boolean>
};
export default store;
