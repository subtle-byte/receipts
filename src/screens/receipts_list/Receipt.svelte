<script lang='ts'>
    import type {Receipt, ReceiptId, Money} from '../../stores/receipts';
    import receipts from '../../stores/receipts';
    import {get_app_context} from '../../app_context';
    import ReceiptEditor from '../ReceiptEditor.svelte';
    import DeleteDialog from '../../dialogs/DeleteItem.svelte';
    import {get_items_merged_by_categories_store} from '../../stores/items_merged_by_categories';
    import StatisticsByCategories from './StatisticsByCategories.svelte';
    import Clickable from '../../buttons/Clickable.svelte';

    export let receipt_id: ReceiptId;
    export let receipt: Receipt;
    export let max_category_price: Money;
    $: items = get_items_merged_by_categories_store(receipt.items);

    let {push_stacked} = get_app_context();
</script>

<Clickable
    on:click={() => push_stacked(ReceiptEditor, {receipt, receipt_id})}
    on:contextmenu={() => push_stacked(DeleteDialog, {
        action: () => receipts.delete_receipt(receipt_id),
        item_name: 'receipt'
    })}
    rounded
>
    <div class='wrapper'>
        {#if $items.length}
            <StatisticsByCategories statistics={$items} max_price={max_category_price} />
        {:else}
            <div class='empty'>Empty receipt</div>
        {/if}
    </div>
</Clickable>

<style>
    .wrapper {
        padding: var(--small-interactive-padding);
        --category-width-shrink: calc(var(--category-width-shrink-for-receipt) + var(--small-interactive-padding));
        min-width: 0;
    }
    .empty {
        pointer-events: none;
        font-style: italic;
    }
</style>
