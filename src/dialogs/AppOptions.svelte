<script lang='ts'>
    import Dialog from './Dialog.svelte';
    import {SaveIcon, RestoreIcon} from '../icons';
    import {save_to_local_file} from '../utils/local_files';
    import receitps_store from '../stores/receipts';
    import type {Date} from '../stores/receipts';
    import categories_store from '../stores/categories';
    import type {Category} from '../stores/categories';
    import {get} from 'svelte/store';
    import {get_values} from '../utils/collections';
    import type {Item, ReceiptId} from '../receipts_db';
    import {checkFloat, checkInt, checkString} from '../utils/primitive_checks';
    import {Button} from '../buttons';

    function backup() {
        let time = new Date().toISOString().replace(/\..*/, '');
        let receipts = get(receitps_store);
        let categories = get(categories_store).list;
        let backup = {
            receipts: get_values(receipts).map(receipt => ({
                id: receipt.id,
                date: get(receipt.date),
                items: get(receipt.items),
            })),
            categories
        };
        save_to_local_file('receipts-backup-' + time + '.json', JSON.stringify(backup));
    }
    let file_input: HTMLInputElement;
    function restore(close: () => void) {
        file_input.onchange = () => {
            let file = file_input.files?.[0];
            if (!file)
                return;

            let reader = new FileReader();
            reader.onload = () => {
                actually_restore(reader.result as string);
                close();
            };
            reader.readAsText(file);
        };
        file_input.click();
    }
    function actually_restore(backup_json: string) {
        let checked_backup = {
            receipts: [] as {id: ReceiptId, date: Date, items: Item[]}[],
            categories: [] as Category[]
        };
        try {
            let backup = JSON.parse(backup_json);
            for (let receipt of backup.receipts) {
                checked_backup.receipts.push({
                    id: checkInt(receipt.id),
                    date: {
                        day: checkInt(receipt.date.day),
                        month: checkInt(receipt.date.month),
                        year: checkInt(receipt.date.year),
                    },
                    items: receipt.items.map((item: any) => ({
                        category_id: checkInt(item.category_id ?? item.category),
                        price: checkFloat(item.price ?? item.money),
                    } as Item)),
                });
            }
            for (let category of backup.categories) {
                checked_backup.categories.push({
                    id: checkInt(category.id),
                    name: checkString(category.name),
                });
            }
        }
        catch (e) {
            alert('Seems like the backup file is corrupted, cannot restore');
            return;
        }
        get(receitps_store).forEach((_, receipt_id) => receitps_store.delete_receipt(receipt_id));
        categories_store.replace(checked_backup.categories);
        for (let receipt of checked_backup.receipts) {
            receitps_store.add_receipt(receipt.date, receipt.items, receipt.id);
        }
    }
</script>

<Dialog let:close={close}>
    <Button icon={SaveIcon}
        no_background on:click={backup}
    >Backup</Button>
    <Button icon={RestoreIcon}
        no_background on:click={() => restore(close)}
    >Restore from backup</Button>

    <input type='file' accept='.json' bind:this={file_input}>
</Dialog>

<style>
    input {
        display: none;
    }
</style>
