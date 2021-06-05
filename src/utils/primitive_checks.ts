export function checkFloat(n: any): number {
    if (!Number.isFinite(n))
        throw new Error();
    return n;
}
export function checkInt(n: any): number {
    if (!Number.isInteger(n))
        throw new Error();
    return n;
}
export function checkString(s: any): string {
    if (typeof s !== 'string')
        throw new Error();
    return s;
}
