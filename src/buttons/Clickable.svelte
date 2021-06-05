<script lang='ts'>
    import {animation_duration_ms, animation_speed_px_per_sec} from 'src/animation';

    export let rounded = false;
    
    function run_ripple(event: MouseEvent) {
        const clickable = event.currentTarget as HTMLDivElement;
        const diameter = Math.max(clickable.clientWidth, clickable.clientHeight);
        const radius = diameter / 2;
        const clickable_bounds = clickable.getBoundingClientRect();
        const circle = document.createElement('span');
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - (clickable_bounds.left + radius)}px`;
        circle.style.top = `${event.clientY - (clickable_bounds.top + radius)}px`;
        circle.classList.add('ripple'); 
        clickable.appendChild(circle);

        const speed = animation_speed_px_per_sec;
        const duration_ms = Math.max(radius / speed * 1000, animation_duration_ms);
        circle.animate([
            {},
            {transform: 'scale(3)', opacity: '0'},
        ], duration_ms);
        setTimeout(() => circle.remove(), duration_ms * 1.5);
    }
</script>

<div class='clickable'
    on:click={run_ripple} on:click
    on:contextmenu={run_ripple} on:contextmenu|preventDefault
    class:rounded
>
    <slot />
</div>

<style>
    .clickable.rounded {
        border-radius: var(--border-radius);
    }
    .clickable {
        overflow: hidden;
        position: relative;

        transition: background-color var(--animation-duration) linear;

        cursor: pointer;
    }
    @media (pointer: fine) {
        .clickable:hover {
            background-color: var(--hovered-button-highlight);
        }
    }

    * > :global(.ripple) {
        pointer-events: none;

        position: absolute;
        border-radius: 50%;

        transform: scale(0);
        background-color: var(--active-button-highlight);
    }
</style>
