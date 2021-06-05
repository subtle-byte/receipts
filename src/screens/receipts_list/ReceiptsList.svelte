<script lang='ts'>
	import ReceiptEditor from '../ReceiptEditor.svelte';
	import months, {get_month_from_id} from '../../stores/receipts_by_months';
	import Month from './Month.svelte';
	import {get_app_context} from '../../app_context';
	import {is_empty} from '../../utils/collections';
	import Screen from '../Screen.svelte';
	import {Button, FlyingAddButton} from '../../buttons';
	import {ThreeDotsVerticallyIcon} from '../../icons';
	import AppOptions from '../../dialogs/AppOptions.svelte';

	$: months_ready = months.ready;

	let {push_stacked} = get_app_context();
</script>

<Screen>
	<svelte:fragment slot='head'>
		<Button />
		<h1 class='screen_title'>Receipts</h1>
		<Button icon={ThreeDotsVerticallyIcon}
			on:click={() => push_stacked(AppOptions, {})}
		/>
	</svelte:fragment>
	<div class='list'>
		{#if $months_ready}
			{#each Object.entries($months).reverse() as [month_id, month_group], index (month_id)}
				<!-- <div transition:scale|local animate:flip> -->
					<Month
						month={get_month_from_id(parseInt(month_id))} month_store={month_group}
						opened={index === 0}
					/>
				<!-- </div> -->
			{/each}
			{#if is_empty($months)}
				<div class='empty'>No receipts, add one</div>
			{/if}
		{/if}
	</div>
</Screen>
<div class='flying_area'>
	<FlyingAddButton on:click={() => push_stacked(ReceiptEditor, {})}/>
</div>

<style>
	.list {
		padding-bottom: 100px;
	}
	.flying_area {
		max-width: calc(var(--column-width) + 200px);
		width: 100%;
		margin: 0 auto;
		position: relative;
		pointer-events: none;
	}
	.flying_area > :global(*) {
		pointer-events: all;
	}
	.empty {
		padding: var(--big-area-padding);
        font-style: italic;
		text-align: center;
	}
</style>
