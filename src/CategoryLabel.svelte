<script lang='ts'>
    export let name: string | undefined;
</script>

<div class:placeholder={!name}>
    {(name ?? 'Unknown') || 'Unnamed'}<br>
</div>

<style>
    div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
