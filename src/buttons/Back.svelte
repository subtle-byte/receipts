<script lang='ts'>
    import {ArrowToLeftIcon} from '../icons';
    import {Button} from '.';
    import {get_app_context} from '../app_context';

    let {pop_stacked} = get_app_context();
</script>

<Button icon={ArrowToLeftIcon} on:click={pop_stacked} />
