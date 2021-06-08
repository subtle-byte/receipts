<script lang='ts'>
    import MainScreen from './screens/receipts_list/ReceiptsList.svelte';
    import type {SvelteComponent} from 'svelte';
    import {set_app_context} from './app_context';
    import {animation_duration_ms} from 'src/animation';

    let stackeds: {stacked: typeof SvelteComponent, component_props: object}[] = [
        {stacked: MainScreen, component_props: {}},
    ];
    set_app_context({
        push_stacked(stacked, component_props) {
            stackeds.push({stacked, component_props}); stackeds = stackeds;
            history.pushState(null, '', '');
        },
        pop_stacked() {
            history.back();
        },
    });
    window.onpopstate = () => {
        if (stackeds.length > 1) {
            stackeds.pop(); stackeds = stackeds;
        }
    };
</script>

<div class='stack' style={`--animation-duration: ${animation_duration_ms}ms`}>
    {#each stackeds as {stacked, component_props}}
        <svelte:component this={stacked} {...component_props}/>
    {/each}
</div>

<style global lang='scss'>
    @use './global.css';
    @use './icons/icon.css';
    
    :local {
        .stack {
            height: 100%;
            width: 100%;

            display: grid;
        }
        .stack > :global(*) {
            grid-area: 1 / 1 / 2 / 2;
            min-width: 0;
            min-height: 0;
            z-index: 0;
        }
    }
</style>
