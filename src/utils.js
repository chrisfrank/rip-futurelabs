export function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function shuffle(array) {
  return array.reduce((shuffled, item, fromIndex) => {
    let toIndex = Math.floor(Math.random() * (fromIndex + 1));
    let current = array[fromIndex];
    shuffled[fromIndex] = shuffled[toIndex];
    shuffled[toIndex] = current;
    return shuffled;
  }, array.slice());
}

export function boundedRandom(lower, upper) {
  return Math.random() * (upper - lower) + lower;
}
