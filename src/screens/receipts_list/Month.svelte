<script lang='ts'>
    import type {Readable} from 'svelte/store';
    import type {MonthGroup, Month} from '../../stores/receipts_by_months';
    import StatisticsByCategories from './StatisticsByCategories.svelte';
    import Day from './Day.svelte';
    import {get_month_statistics_store} from '../../stores/month_statistics';
    import Clickable from '../../buttons/Clickable.svelte';
    import {slide} from 'src/animation';

    export let month_store: Readable<MonthGroup>;
    export let month: Month;
    export let opened = true;
    let steady_opened = opened;

    let month_statistics_store = get_month_statistics_store(month_store);
</script>

<div class='month_group'>
    <Clickable on:click={() => steady_opened = !steady_opened}>
        <div class='month_intro' class:opened={steady_opened}>
            <div class='head'>
                <h1>{new Date(month.year, month.month - 1, 1).toLocaleString('default', {
                    month: 'long', year: new Date().getFullYear() === month.year ? undefined : 'numeric'
                })}</h1>
                <div class='sum'><b>Σ</b> {$month_statistics_store.price}</div>
            </div>
            {#if $month_statistics_store.by_categories.size}
                <StatisticsByCategories statistics={[...$month_statistics_store.by_categories.entries()].map(([category_id, price]) => ({category_id, price}))} />
            {/if}
        </div>
    </Clickable>
    {#if steady_opened}
        <div class='days' transition:slide|local>
            {#each Object.entries($month_store).reverse() as [day, day_group] (day)}
                <!-- <div transition:slide|local animate:flip> -->
                    <Day day={parseInt(day)} {day_group} />
                <!-- </div> -->
            {/each}
        </div>
    {/if}
</div>

<style>
    .month_group, .month_intro {
        display: flex;
        flex-direction: column;
    }
    .month_group {
        padding: var(--interactive-padding) 0;  
    }
    .days {
        padding-top: var(--small-interactive-padding);
    }
    .month_intro.opened {
        border-left-style: solid;
    }
    .month_intro {
        border-left: 2px dashed var(--foreground-color);
        margin-left: 2px;
        padding: var(--interactive-padding);
        padding-left: calc(var(--small-interactive-padding) - 4px);
        cursor: pointer;
        gap: var(--small-interactive-padding);
    }
    @media (prefers-color-scheme: dark) {
        .month_intro {
            margin-left: 0;
            padding-left: calc(var(--small-interactive-padding) - 2px);
        }
    }
    .month_intro * {
        pointer-events: none;
    }
    .head {
        display: flex;
        align-items: center;
    }
    .sum {
        margin-left: auto;
    }
	h1 {
		font-size: 1.5rem;
        line-height: 1;
	}
</style>
