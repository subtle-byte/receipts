import {SvelteComponent, getContext, setContext} from 'svelte';

type ComponentConstructor<P> = {
    new (options: {props?: P}): any,
};

const key = {};
export type AppContext = {
    push_stacked<P>(stacked: typeof SvelteComponent & ComponentConstructor<P>, component_props: object & P),
    pop_stacked(),
};
export function set_app_context(app_context: AppContext) {
    setContext(key, app_context);
}
export function get_app_context(): AppContext {
    return getContext(key);
}
