<script lang='ts'>
    import {fly} from 'src/animation';
</script>

<div class='screen' transition:fly={{x: 50}}>
    <div class='head'>
        <slot name='head' />
    </div>
    <div class='content'>
        <slot />
    </div>
</div>

<style>
    .screen, .head, .content {
        display: flex;
    }
    .screen, .head {
        background-color: var(--background-color);
    }
    .screen, .content {
        flex-direction: column;
    }
    .screen {
        overflow: auto;
        position: relative;
    }
    .head, .content {
        max-width: var(--column-width);
        width: 100%;
        margin: 0 auto;
    }
    .content {
        flex-grow: 1;
    }
    .head {
        position: sticky;
        top: 0;
        z-index: 1;
        align-items: center;
        padding: 0 var(--gap);
    }
    * :global(.screen_title) {
        line-height: 1;
        font-weight: bold;
        font-size: 1.1rem;
        padding: var(--big-area-padding);
        margin: 0 auto;
    }
    * :global(.bottom_sticky_container) {
        padding: var(--big-area-padding);
        flex-grow: 1;
        position: sticky;
        bottom: 0;
        background-color: var(--background-color);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
    }
</style>
