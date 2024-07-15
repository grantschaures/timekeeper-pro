let transitionTime = [0, 5, 10, 15, 20, 25];
let labelA = [1, 4, 12, 23];
let intervalArr = [];

for (let i = 0; i < labelA.length; i++) {
    for (let j = 0; j < transitionTime.length; j++) {
        if ((labelA[i] < transitionTime[j]) || ((labelA[i] <= transitionTime[j]) && (j === transitionTime.length - 1))) {
            if (j % 2 !== 0) {
                intervalArr.push("DW");
            } else {
                intervalArr.push("B");
            }
            break;
        }
    }
}

console.log(intervalArr);