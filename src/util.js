// Returns an array containing int values from 0 (inclusive) to i (exclusive).
function range(i) {
    return Array.from(Array(i).keys());
}

// Returns a random integer between 0 (inclusive) and max (exclusive).
function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export { range, randomInt };