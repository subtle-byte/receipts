<script lang='ts'>
    import {PlusIcon} from 'src/icons';
</script>

<div class='button' on:click>
    <div class='icon_wrapper'><PlusIcon /></div>
</div>

<style>
    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        
        border-radius: 50%;
        width: 55px;
        height: 55px;
        background-color: var(--foreground-color);
        --icon-color: var(--background-color);
        cursor: pointer;

        position: absolute;
        bottom: 25px;
        right: 25px;
    }
    .icon_wrapper {
        width: 20px;
        height: 20px;
    }
</style>
