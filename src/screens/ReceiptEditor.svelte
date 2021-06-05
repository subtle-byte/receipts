<script lang='ts'>
    import {onDestroy, onMount} from 'svelte';
    import receipts from '../stores/receipts';
    import type {Receipt, ReceiptId} from '../stores/receipts';
    import categories from '../stores/categories';
    import type {CategoryId} from '../stores/categories';
    import {writable} from 'svelte/store';
    import {get_app_context} from '../app_context';
    import DeleteDialog from '../dialogs/DeleteItem.svelte';
    import CategorySelector from '../dialogs/CategorySelector.svelte';
    import CategoryLabel from '../CategoryLabel.svelte';
    import Screen from './Screen.svelte';
    import {Button, BackButton} from '../buttons';
    import {BinIcon} from '../icons';
    import {is_empty} from '../utils/collections';
    import {NumberInput, DateInput} from 'src/inputs';

    export let receipt_id: ReceiptId | undefined = undefined;
    export let receipt: Receipt | undefined = undefined;
    function get_date_now() {
        let now = new Date();
        return {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    }
    let date = receipt?.date ?? writable(get_date_now());
    let items = receipt?.items ?? writable([]);

    $: sum = $items.reduce((sum, next_item) => sum += next_item.price, 0);

    onDestroy(() => {
        if (!receipt)
            receipts.add_receipt($date, $items);
    });

    let {push_stacked, pop_stacked} = get_app_context();

    // It is for scrollIntoView call after virtual keyboard appearing.
    // It is needed when there is no scroll bar without keyboard, but it IS after keyboard appearing.
    // The same behavior is detected on Chrome (but not in CategoriesEditor for some reason) and Firefox.
    let focused: HTMLElement | undefined;
    onMount(() => {
        let focus = () => {
            if (focused && document.activeElement === focused)
                focused.scrollIntoView();
        };
        window.addEventListener('resize', focus);
        return () => window.removeEventListener('resize', focus);
    });

    function delete_item(item_index: number) {
        $items.splice(item_index, 1); $items = $items;
    }
    function add_item(category_id: CategoryId) {
        $items.push({category_id, price: 0}); $items = $items;
    }

    function delete_receipt() {
        receipts.delete_receipt(receipt_id!);
    }
</script>

<Screen>
    <svelte:fragment slot='head'>
        <BackButton />
        <h1 class='screen_title'>{receipt ? 'Receipt' : 'New receipt'}</h1>
        <Button icon={BinIcon} hidden={!receipt_id}
            on:click={() => push_stacked(DeleteDialog, {  
                action: () => {
                    delete_receipt();
                    pop_stacked();
                },
                item_name: 'receipt'
            })}
        />
    </svelte:fragment>
    <div class='date'>
        <h2>Date</h2>
        <DateInput bind:date={$date} />
    </div>
    <h2 class='items_title'>Items</h2>
    <div class='items'>
        {#each $items as item, item_index}
            <div class='item'>
                <Button icon={BinIcon}
                    on:click={() => push_stacked(DeleteDialog, {action: () => delete_item(item_index)})}
                />
                <div class='flexible'>
                    <Button no_background
                        on:click={() => push_stacked(CategorySelector, {action: category_id => item.category_id = category_id})}
                    >
                        <div class='category_label_wrapper'>
                            <CategoryLabel name={$categories.by_id.get(item.category_id)?.name} />
                        </div>
                    </Button>
                </div>
                <div class='flexible'>
                    <NumberInput
                        value={item.price || undefined}
                        placeholder='Money'
                        on:input={event => item.price = event.detail.value || 0}
                        on:focus={event => focused = event.detail.target}
                    />
                </div>
                <Button />
            </div>
        {/each}
    </div>
    {#if is_empty($items)}
        <div class='empty'>No items</div>
    {/if}
    <div class='bottom_sticky_container'>
        <Button no_focus
            on:click={() => push_stacked(CategorySelector, {action: add_item})}
        >Add item</Button>
        <div><b>Σ</b> {sum}</div>
    </div>
</Screen>

<style>
    .date, .items, .item {
        display: flex;
        gap: var(--gap);
    }
    .date {
        justify-content: center;
        align-items: center;
    }
    .items {
        flex-direction: column;
    }
    .item {
        align-items: center;
        padding: 0 var(--gap);
    }
    h2 {
        font-weight: bold;
        text-align: center;
    }
    .items_title {
        padding: var(--big-area-padding) 0;
    }
    .bottom_sticky_container {
        gap: var(--big-area-padding);
    }
    .flexible {
        flex: 1 1 0;
        min-width: 0;
    }
    .category_label_wrapper {
        margin-left: auto;
    }
    .empty {
		padding: var(--small-interactive-padding);
        font-style: italic;
        text-align: center;
	}
</style>
