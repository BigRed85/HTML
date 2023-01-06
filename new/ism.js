function bubblesort() {
    var array = [2, 3, 1, 6, 5, 4, 3, 7, 2, 4, 6];
    for (let i = 1; i < array.length; i++) {
        for(let j = i; j > 0 && array[j-1] > array[j]; j--) {
                let temp = array[j];
                array[j] = array[j-1];
                array[j-1] = temp;
        }
    }
    console.log(array);
}



bubblesort();