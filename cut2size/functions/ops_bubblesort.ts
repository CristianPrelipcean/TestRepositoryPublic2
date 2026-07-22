ops_Bubblesort(arr: number[]): number[] {
  const len = arr.length;

  // Sorting
  for (let i = 0; i < len - 1; i++) {
    let swapped = false;

    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

	  // Stop if the array is sorted
    if (!swapped) {
      break;
    }
  }

  // Delete doubled values
  const uniqueSortedArray = arr.filter((value, index) => arr.indexOf(value) === index);

  // Return sorted Array
  return uniqueSortedArray;
}