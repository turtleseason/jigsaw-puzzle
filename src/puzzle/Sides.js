export const LEFT = 'Left';
export const TOP = 'Top';
export const RIGHT = 'Right';
export const BOTTOM = 'Bottom';

// Use this to iterate through all four sides in a consistent order.
export const Sides = {
    *[Symbol.iterator]() {
        yield LEFT;
        yield TOP;
        yield RIGHT;
        yield BOTTOM;
    }
}