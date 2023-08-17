export type Color = `#${string}`;
export function isColorValid(s: string) {
    return s.startsWith('#') && ( s.length == 7 || s.length == 4 );
}
