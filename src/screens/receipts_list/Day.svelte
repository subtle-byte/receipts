<script lang='ts'>
    import type {DayGroup} from '../../stores/receipts_by_months';
    import Receipt from './Receipt.svelte';

    export let day: number;
    export let day_group: DayGroup;
</script>

<div class='day_group'>
    <div class='day'>{day}</div>
    <div class='receipts'>
        {#each Object.entries(day_group).reverse() as [receipt_id, receipt] (receipt_id)}
            <!-- <div transition:slide|local animate:flip> -->
                <Receipt receipt_id={parseInt(receipt_id)} {receipt} />
            <!-- </div> -->
        {/each}
    </div>
</div>

<style>
    .day_group {
        display: flex;
        align-items: flex-start;
        --day-width: 35px;
    }
    .day {
        text-align: center;
        font-weight: bold;
        background-color: var(--foreground-color);
        color: var(--background-color);
        border-radius: var(--border-radius);
        width: var(--day-width);
        margin: var(--small-interactive-padding);
        margin-right: var(--gap);
        flex-shrink: 0;
    }
    .receipts {
        flex-grow: 1;
        min-width: 0;
        --category-width-shrink-for-receipt: calc(var(--day-width) + var(--gap));
    }
</style>
