import {writable} from 'svelte/store';

export type CategoryId = number & {};
export type Category = {
    id: CategoryId,
    name: string,
};

const local_storage_name = 'categories';
let categories_list: Category[] = [
    {id: 0, name: 'Food'},
    {id: 1, name: 'Transport'},
    {id: 2, name: 'Home'},
];
function load_categories(): boolean {
    let str = localStorage.getItem(local_storage_name);
    if (str)
        categories_list = JSON.parse(str);
    return Boolean(str);
}
function save_categories() {
    localStorage.setItem(local_storage_name, JSON.stringify(categories_list));
}
if (!load_categories())
    save_categories();

let categories_by_id = new Map<CategoryId, Category>();
let next_id = 0;
function update_categories_by_id_and_next_id() {
    categories_by_id.clear();
    for (let category of categories_list) {
        categories_by_id.set(category.id, category);
        next_id = Math.max(next_id, category.id);
    }
    next_id++;
}
update_categories_by_id_and_next_id();

let {subscribe, update} = writable({list: categories_list, by_id: categories_by_id});
let on_categories_list_update = () => {};
subscribe(() => {
    on_categories_list_update();
});
on_categories_list_update = () => {
    update_categories_by_id_and_next_id();
    save_categories();
};

export default {
    subscribe,
    rename(category_id: CategoryId, new_name: string) {
        let category = categories_by_id.get(category_id);
        if (category) {
            category.name = new_name;
            update(it => it);
        }
    },
    add() {
        categories_list.push({id: next_id++, name: ''});
        update(it => it);
    },
    remove_by_index_in_list(index: number) {
        categories_list.splice(index, 1);
        update(it => it);
    },
    replace(new_categories: Category[]) {
        categories_list.length = 0;
        categories_list.push(...new_categories);
        update(it => it);
    }
};
