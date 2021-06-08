import {SvelteComponent, getContext, setContext} from 'svelte';

type ComponentConstructorOptions<C extends typeof SvelteComponent> =
    ConstructorParameters<C> extends [options: infer O] ? O : never;

type ComponentProps<C extends typeof SvelteComponent> =
    ComponentConstructorOptions<C> extends {props?: infer P} ? P : never;

const key = {};
export type AppContext = {
    push_stacked<C extends typeof SvelteComponent>(stacked: C, component_props: object & ComponentProps<C>): void,
    pop_stacked(): void,
};
export function set_app_context(app_context: AppContext) {
    setContext(key, app_context);
}
export function get_app_context(): AppContext {
    return getContext(key);
}
