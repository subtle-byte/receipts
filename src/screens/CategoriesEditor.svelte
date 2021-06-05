<script lang='ts'>
    import categories from '../stores/categories';
    import type {CategoryId} from '../stores/categories';
    import {Button, BackButton} from '../buttons';
    import {BinIcon} from '../icons';
    import categories_usage_store from '../stores/categories_usage';
    import Screen from './Screen.svelte';
    import {LineInput} from 'src/inputs';

    let get_usages_number = (category_id: CategoryId) => $categories_usage_store.get(category_id);
</script>

<Screen>
    <svelte:fragment slot='head'>
        <BackButton />
        <h1 class='screen_title'>Categories</h1>
        <Button />
    </svelte:fragment>
    <div class='list'>
        {#each $categories.list as category, category_index}
            <div class='item'>
                <Button icon={BinIcon} hidden={Boolean(get_usages_number(category.id))}
                    on:click={() => categories.remove_by_index_in_list(category_index)}
                />
                <div class='category_input_wrapper'>
                    <LineInput centered_text
                        value={category.name} 
                        on:input={event => categories.rename(category.id, event.detail.value)}
                        placeholder='Unnamed'
                    />
                </div>
                <Button />
            </div>            
        {/each}
        {#if $categories.list.length === 0}
            <div class='empty'>No categories</div>
        {/if}
    </div>
    <div class='bottom_sticky_container'>
        <Button no_focus
            on:click={() => {
                categories.add();
            }}
        >Add category</Button>
    </div>
</Screen>

<style>
    .category_input_wrapper {
        flex-grow: 1;
    }
    .item {
        display: flex;
        gap: var(--gap);
    }
    .empty {
		padding: var(--interactive-padding);
        font-style: italic;
        text-align: center;
	}
</style>
