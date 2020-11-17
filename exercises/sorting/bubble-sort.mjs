export function bubbleSort(array) {
  const result = [...array];

  for (let i = 0; i < result.length; i++) {
    for (let j = i + 1; j < result.length; j++) {
      if (result[i] > result[j]) {
        [result[i], result[j]] = [result[j], result[i]];
      }
    }
  }

  return result;
}
