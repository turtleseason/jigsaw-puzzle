// Returns an array containing int values from 0 (inclusive) to i (exclusive).
export function range(i) {
    return Array.from(Array(i).keys());
}

// Returns a random integer between 0 (inclusive) and max (exclusive).
export function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Restricts x to the range between min and max (inclusive).
export function clamp(x, min, max) {
    if (min > max) {
        throw Error(`clamp: min (${min}) is greater than max (${max}).`);
    }
    return Math.max(Math.min(x, max), min);
}

// Creates an object where the "keys" iterable provides the keys
// and each value is the result of passing its corresponding key to keyToValueFunc.
export function objectMap(keys, keyToValueFunc) {
    const obj = {};
    for (const i of keys) {
        obj[i] = keyToValueFunc(i);
    }
    return obj;
}