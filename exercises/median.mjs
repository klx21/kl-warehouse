/**
 * The time complexity may be O(n^2) as the sorting may be a simple bubble sort.
 * The space complexity should be O(1).
 *
 * @param array
 * @returns {number}
 */
export function calculateMedian(array) {
  const sorted = array.sort((a, b) => {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  });

  if (sorted.length % 2 !== 0) {
    return sorted[(sorted.length + 1) / 2];
  } else {
    return (sorted[sorted.length / 2] + sorted[sorted.length / 2 + 1]) / 2;
  }
}
