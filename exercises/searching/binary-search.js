function searchBinarily(sortedArray, target) {
  let left = 0;
  let right = sortedArray.length -1;

  while (left <= right) {
    let middle = Math.floor((left + right) / 2);

    if (target === sortedArray[middle]) {
      return middle;
    } else {
      if (target > sortedArray[middle]) {
        left = middle + 1;
      } else {
        right = middle - 1;
      }
    }
  }

  return null;
}
