import type {CategoryId} from './stores/categories';

export type Money = number & {};
export type Item = {
    category_id: CategoryId,
    price: Money,
}
export type ReceiptId = number & {};

export type PlainReceipt = {
    year: number,
    month: number,
    day: number,
    items: Item[]
};

type Task = (db: IDBDatabase) => void
let scheduled_tasks: Task[] = [];
let schedule_task = (task: Task) => {
    scheduled_tasks.push(task);
};

let open_request = indexedDB.open('app_db', 2);
open_request.onerror = () => {
    alert('Some error while opening database: ' + open_request.error);
};
open_request.onupgradeneeded = event => {
    let db = open_request.result;

    switch (event.oldVersion) {
        case 0: {
            // let receipts =
            db.createObjectStore('receipts', {autoIncrement: true});
            // receipts.createIndex('months_index', ['year', 'month']);
        }
        case 1: {
            let transaction = open_request.transaction!;
            let receipts = transaction.objectStore('receipts');

            let request = receipts.openCursor();
            request.onsuccess = () => {
                let cursor = request.result;
                if (cursor) {
                    let receipt: PlainReceipt = cursor.value;
                    receipt.items = receipt.items.map((item) => ({
                        category_id: (item as any).category as CategoryId,
                        price: item.price
                    }));
                    cursor.update(receipt);
                    cursor.continue();
                }
            };
            request.onerror = console.error;
        }
    }
};
open_request.onblocked = () => {
    alert('Database is blocked - a bug.');
};
open_request.onsuccess = () => {
    let db = open_request.result;

    db.onversionchange = () => {
        db.close();
        alert('Database is outdated, please reload the page.');
    };

    schedule_task = (task: Task) => task(db);
    for (let task of scheduled_tasks)
        task(db);
};

export function get_all_receipt_ids(callback: (receipt_ids: ReceiptId[]) => void) {
    schedule_task(db => {
        let transaction = db.transaction('receipts');
        let receipts = transaction.objectStore('receipts');

        let request = receipts.getAllKeys();
        request.onsuccess = () => {
            callback(request.result as ReceiptId[]);
        };
        request.onerror = console.error;
    });
}
function private_get_receipt(db: IDBDatabase, receipt_id: ReceiptId, callback: (plain_receipt: PlainReceipt) => void) {
    let transaction = db.transaction('receipts');
    let receipts = transaction.objectStore('receipts');

    let request = receipts.get(receipt_id);
    request.onsuccess = () => callback(request.result);
    request.onerror = console.error;
}
export function get_receipt(receipt_id: ReceiptId, callback: (plain_receipt: PlainReceipt) => void) {
    schedule_task(db => {
        private_get_receipt(db, receipt_id, callback);
    });
}
export function update_receipt(receipt_id: ReceiptId, receipt_update: Partial<PlainReceipt>) {
    schedule_task(db => {
        private_get_receipt(db, receipt_id, plain_receipt => {
            Object.assign(plain_receipt, receipt_update);

            let transaction = db.transaction('receipts', 'readwrite');
            let receipts = transaction.objectStore('receipts');
            
            let request = receipts.put(plain_receipt, receipt_id);
            request.onerror = console.error;
        });
    }); 
}
export function add_receipt(plain_receipt: PlainReceipt, callback: (id: ReceiptId) => void, receipt_id?: ReceiptId) {
    schedule_task(db => {
        let transaction = db.transaction('receipts', 'readwrite');
        let receipts = transaction.objectStore('receipts');

        let request = receipts.add(plain_receipt, receipt_id);
        request.onsuccess = () => callback(request.result as ReceiptId);
        request.onerror = console.error;
    });
}
export function delete_receipt(receipt_id: ReceiptId) {
    schedule_task(db => {
        let transaction = db.transaction('receipts', 'readwrite');
        let receipts = transaction.objectStore('receipts');
    
        let request = receipts.delete(receipt_id);
        request.onerror = console.error;
    });   
}
