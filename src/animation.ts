export let animation_duration_ms = 160;
export let animation_speed_px_per_sec = 500;

import * as t from 'svelte/transition';
export const slide = (node, params) => t.slide(node, {duration: animation_duration_ms, ...params});
export const fly = (node, params) => t.fly(node, {duration: animation_duration_ms, ...params});
export const scale = (node, params) => t.scale(node, {duration: animation_duration_ms, ...params});
export const fade = (node, params) => t.fade(node, {duration: animation_duration_ms, ...params});
