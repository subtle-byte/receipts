export type ForEach<I, V> = (callbackfn: (value: V, index: I) => void) => void;
export interface HasForEach<I, V> {
    forEach: ForEach<I, V>,
}

export type Some<I, V> = (predicate: (value: V, index: I) => unknown) => boolean;
export interface HasSome<I, V> {
    some: Some<I, V>,
}

export function is_empty<I, V>(it: HasSome<I, V>): boolean {
    return !it.some(_ => true);
}

export type SparseArray<K extends number, T> = {[id: number]: T} & HasForEach<number, T> & HasSome<number, T>;

export function get_values<I, V>(collection: HasForEach<I, V>): V[] {
    let values: V[] = [];
    collection.forEach(value => values.push(value));
    return values;
}