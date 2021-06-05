<script lang='ts'>
    import Dialog from './Dialog.svelte';
    import {Button} from '../buttons';
    
    export let action: () => void;
    export let item_name = 'item';
</script>

<Dialog let:close={close}>
    <h1 class='dialog_title'>Delete the {item_name.toLowerCase()}?</h1>
    <div class='delete_button_wrapper'>
        <Button on:click={action} on:click={close} small focused>
            <div class='delete_label'>Delete</div>
        </Button>
    </div>
</Dialog>

<style>
    .dialog_title, .delete_button_wrapper {
        padding: var(--small-interactive-padding);
    }
    .delete_label {
        text-align: center;
        flex-grow: 1;
    }
    .delete_button_wrapper {
        --button-background-color: red;
        color: var(--background-color);
        font-weight: bold;
    }
</style>
