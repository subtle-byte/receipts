<script lang='ts'>
    import type {Date} from 'src/stores/receipts';

    export let date: Date;

    function date_to_str(date: Date) {
        let pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(date.year)}-${pad(date.month)}-${pad(date.day)}`;
    }
    let date_str = date_to_str(date);

    function update_date_str(date: Date) {
        date_str = date_to_str(date);
    }
    $: update_date_str(date);
    $: if (/\d{4}-\d{2}-\d{2}/.test(date_str)) {
        let [year, month, day] = date_str.split('-').map(str => parseInt(str));
        if (date.year !== year || date.month !== month || date.day !== day)
            date = {year, month, day};
    } else {
        date_str = date_to_str(date);
    }
</script>

<div>
    <input type='date' bind:value={date_str} required pattern='\d{4}-\d{2}-\d{2}'>
</div>

<style>
    input {
        line-height: 1.5em;
        padding: calc(var(--interactive-padding) - 0.25em) var(--interactive-padding);
        width: 100%;
        cursor: text;
        border-radius: var(--border-radius);
    }
    /* input:hover, input:focus {
        background-color: var(--hovered-button-highlight);
    } */ /* Disabled because of bad padding on Firefox */
</style>
