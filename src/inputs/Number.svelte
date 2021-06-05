<script lang='ts'>
    import {auto_focus_input} from './auto_focus_input';

    export let value: number | undefined = undefined;
    export let placeholder: string | undefined = undefined;

    import {createEventDispatcher} from 'svelte';
	const dispatch = createEventDispatcher<{
        input: {value: number},
        focus: {target: HTMLElement}
    }>();
</script>

<div in:auto_focus_input|local>
    <input type='number'
        bind:value {placeholder}
        on:input={event => dispatch('input', {value: parseFloat(event.currentTarget.value)})}
        on:focus={event => dispatch('focus', {target: event.currentTarget})}
    >
</div>

<style>
    input {
        line-height: 1.5em;
        padding: calc(var(--interactive-padding) - 0.25em) var(--interactive-padding);
        width: 100%;
        cursor: text;
        -moz-appearance: textfield;
        border-radius: var(--border-radius);
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input:hover, input:focus {
        background-color: var(--hovered-button-highlight);
    }
</style>
