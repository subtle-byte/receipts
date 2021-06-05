export function auto_focus_input(node: HTMLElement, _: any) {
    let input = node.querySelector('input')!;
    input.focus();
    input.scrollIntoView();
    return {};
}
