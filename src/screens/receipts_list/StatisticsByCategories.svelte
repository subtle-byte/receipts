<script lang='ts'>
    import CategoryLabel from '../../CategoryLabel.svelte';
    import categories from '../../stores/categories';
    import type {CategoryId} from '../../stores/categories';
    import type {Money} from '../../stores/receipts';

    export let statistics: {category_id: CategoryId, price: Money}[];
    $: sorted_statistics = statistics.sort((a, b) => b.price - a.price);

    $: max_price = statistics.map(({price}) => price).reduce((a, b) => Math.max(a, b), 0);
    
</script>

<div class='root'>
    {#each sorted_statistics as {category_id, price}}
        <div class='item'>
            <div class='category'>
                <CategoryLabel name={$categories.by_id.get(category_id)?.name} />
            </div>
            <div class='indicator'>
                <div class='line' style={`width:${price / max_price * 100}%`} />
            </div>
            <div class='price'>{price}</div>
        </div>
    {/each}
</div>

<style>
    .root {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    * {
        pointer-events: none;
    }
    .item {
        display: flex;
        align-items: center;
        gap: var(--small-interactive-padding);
    }
    .item > * {
        min-width: 0;
    }
    .category {
        flex: 1 1 calc(150px - var(--category-width-shrink, 0px));
    }
    .indicator {
        flex: 2 2 40px;
    }
    .line {
        background-color: var(--foreground-color);
        height: 4px;
        min-width: 2px;
        border-radius: var(--border-radius);
    }
    .price {
        flex: 1 1 60px;
        max-width: 90px;
        text-align: right;
    }
</style>
