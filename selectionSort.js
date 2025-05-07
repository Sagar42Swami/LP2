function selectionSort(arr) {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
        let minIndex = i; // Assume the current element is the minimum

        // Find the index of the minimum element in the unsorted part of the array
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j; // Update minIndex if a smaller element is found
            }
        }

        // If the minimum element is not at the current position, swap them
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; //destructuring swap
        }
    }

    return arr;
}

// Example Usage:
let array = [64, 25, 12, 22, 11];
let sortedArray = selectionSort(array);
console.log("Sorted array:", sortedArray); // Output: [11, 12, 22, 25, 64]
