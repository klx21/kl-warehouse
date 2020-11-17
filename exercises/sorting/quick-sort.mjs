const array = [8, 9, 6, 1, 0, 9, 2];

console.log(sort());

export function quickSort(array) {
  const copy = [...array];

  return sort(copy);
}

// function sort(array) {
//   if (array.length === 1) {
//     return array;
//   }
//   let pivot = array.length - 1;
//   let second;
//
//   for (let i = 0; i < array.length; i++) {
//     if (array[i] > array[pivot] && typeof second === 'undefined') {
//       second = i;
//     }
//     if (array[i] < array[pivot] && typeof second !== 'undefined') {
//       [array[i], array[second]] = [array[second], array[i]];
//       second = undefined;
//     }
//   }
//
//   [array[pivot], array[second]] = [array[second], array[pivot]];
//
//   return second;
// }

function partitionInPlace(array, lo, hi) {
  const pivot = hi;
  let firstGreater = lo;

  for (let i = lo; i < hi; i++) {
    if (array[i] <= array[pivot] && i !== firstGreater) {
      [array[i], array[firstGreater]] = [array[firstGreater], array[i]];
      firstGreater++;
    }
  }

  [array[pivot], array[firstGreater]] = [array[firstGreater], array[pivot]];

  return firstGreater;
}

function sortInPlace(array, lo, hi) {
  if (lo < hi) {
    
  }
}
