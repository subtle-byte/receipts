export let animation_duration_ms = 160;
export let animation_speed_px_per_sec = 500;

function set_duration<P extends {duration?: number}, R>(fn: (node: Element, params?: P) => R) {
    return (node: Element, params: P) => fn(node, {duration: animation_duration_ms, ...params});
}

import * as t from 'svelte/transition';
export const slide = set_duration(t.slide);
export const fly = set_duration(t.fly);
export const scale = set_duration(t.scale);
export const fade = set_duration(t.fade);
