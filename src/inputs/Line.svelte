<script lang='ts'>
    import {auto_focus_input} from './auto_focus_input';

    export let centered_text = false;
    export let value: string | undefined = undefined;
    export let placeholder: string | undefined = undefined;

    import {createEventDispatcher} from 'svelte';
	const dispatch = createEventDispatcher<{
        input: {value: string},
    }>();
</script>

<div in:auto_focus_input|local>
    <input class:centered_text
        bind:value {placeholder}
        on:input={event => dispatch('input', {value: event.currentTarget.value})}
    >
</div>

<style>
    input {
        width: 100%;
        cursor: text;
        line-height: 1.5em;
        padding: calc(var(--interactive-padding) - 0.25em) var(--interactive-padding);
        border-radius: var(--border-radius);
    }
    input.centered_text {
        text-align: center;
    }
    input:hover, input:focus {
        background-color: var(--hovered-button-highlight);
    }
</style>
