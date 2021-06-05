<script lang='ts'>
    import type {SvelteComponent} from 'svelte';
    import Clickable from './Clickable.svelte';

    export let icon: typeof SvelteComponent | undefined = undefined;
    export let no_background = icon !== undefined;
    export let no_focus = false;
    export let small = false;
    export let hidden = false;
    export let focused = false;

    function handle_mouse_down(event: MouseEvent) {
        if (no_focus)
            event.preventDefault();
    }

    $: icon_only = icon && !$$slots.default;
    $: empty = !icon && !$$slots.default;
    $: icon_wrapper_needed = icon || !$$slots.default;

    let button: undefined | HTMLElement;
    $: if (focused)
        button?.focus();
</script>

<div class='button'
    tabindex='0' bind:this={button}
    class:no_background class:icon_only class:hidden={empty || hidden}
    on:keydown={event => {
        if (event.code === 'Enter')
            event.currentTarget.click();
    }}
    on:click
    on:mousedown={handle_mouse_down}
>
    <Clickable>
        <div class:small class='content'>
            {#if icon_wrapper_needed}
                <div class='icon_wrapper'>
                    <svelte:component this={icon} />
                </div>
            {/if}
            <slot />
        </div>
    </Clickable>
</div>

<style>
    .button {
        border-radius: var(--border-radius);
        overflow: hidden;
        background-color: var(--button-background-color);
    }
    .content {
        padding: var(--interactive-padding);
        display: flex;
        align-items: center;
        gap: var(--interactive-padding);
        line-height: 1;
    }
    .content.small {
        padding: var(--small-interactive-padding);
    }
    .icon_wrapper {
        flex-grow: 0;
        width: 1.05rem;
        height: 1.05rem;
    }
    .button.icon_only {
        border-radius: 50%;
    }
    .button.no_background {
        background-color: transparent;
    }
</style>
