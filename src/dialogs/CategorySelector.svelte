<script lang='ts'>
    import Dialog from './Dialog.svelte';
    import categories from '../stores/categories';
    import type {CategoryId} from '../stores/categories';
    import {Button} from '../buttons';
    import {PencilIcon} from '../icons';
    import {get_app_context} from '../app_context';
    import CategoriesEditor from '../screens/CategoriesEditor.svelte';
    import CategoryLabel from '../CategoryLabel.svelte';
    
    export let action: (category_id: CategoryId) => void;

    let {push_stacked} = get_app_context();
</script>

<Dialog let:close={close}>
    <svelte:fragment slot='head'>
        <h1 class='dialog_title'>Select category</h1>
        <Button icon={PencilIcon}
            on:click={() => push_stacked(CategoriesEditor, {})}
        />
    </svelte:fragment>
    {#each $categories.list as category}
        <Button no_background no_focus
            on:click={close} on:click={() => action(category.id)}
        >
            <CategoryLabel name={category.name} />
        </Button>
    {/each}
    {#if $categories.list.length === 0}
        <div class='empty'>No categories</div>
    {/if}
</Dialog>

<style>
    .empty {
		padding: var(--big-area-padding);
        font-style: italic;
        text-align: center;
	}
</style>
