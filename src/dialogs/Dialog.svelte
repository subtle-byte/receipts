<script lang='ts'>
    import {get_app_context} from '../app_context';
    import {fade, scale} from 'src/animation';

    let app_context = get_app_context();
    let close = app_context.pop_stacked;
</script>

<div class='curtain' on:click|self={close} transition:fade>
    <div class='window' transition:scale={{start: 0.9}}>
        <div class='head'>
            <slot name='head' />
        </div>
        <div class='content'>
            <slot {close} />
        </div>
    </div>
</div>

<style>
    .curtain {
        background-color: var(--curtain-color);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .window {
        min-width: 300px;
        max-width: 90%;
        max-height: 90%;
        background-color: var(--dialog-background-color);
        border-radius: var(--border-radius);
        overflow: hidden; /* for scroll bar */
        display: flex;
        flex-direction: column;
    }
    * :global(.dialog_title) {
        line-height: 1;
        font-weight: bold;
        font-size: 1.1rem;
        text-align: center;
        padding: var(--interactive-padding);
    }
    .head {
        display: flex;
        align-items: center;
        gap: var(--gap);
    }
    .head > :global(:nth-child(2)) {
        margin-left: auto;
    }
    .head:not(:empty), .content:not(:empty) {
        padding: var(--gap);
    }
    .head:not(:empty) ~ .content:not(:empty) {
        padding-top: 0;
    }
    .head:empty ~ .content:not(:empty) {
        padding-bottom: var(--small-interactive-padding);
        padding-top: var(--small-interactive-padding);
    }
    .content {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex-shrink: 1;
    }
</style>
