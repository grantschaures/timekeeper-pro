let arr = [0, 5, 7, 12, 15, 18, 20, 22, 25]; // 5
let breakInterval = false;
let hourSumArr = [];

let startOfHour = 25;
let previousHour = 15;

// for (let i = 0; i < arr.length; i++) {
//     if (arr[i] > previousHour) {
//         if (i % 2 === 1) { // if i is odd
//             if (breakInterval) {
//                 hourSumArr.push(arr[i] - arr[i-1])
//                 breakInterval = false;
//             } else {
//                 hourSumArr.push(arr[i] - previousHour)
//             }
//         } else { // if i is even
//             breakInterval = true;
//         }
//     }
// }

let i = 0;
while (arr[i] < startOfHour) {
    if (arr[i] >= previousHour) {
        if (i % 2 === 1) { // if i is odd
            if (breakInterval) {
                hourSumArr.push(arr[i] - arr[i-1])
                breakInterval = false;
            } else {
                hourSumArr.push(arr[i] - previousHour)
            }
        } else { // if i is even
            breakInterval = true;
        }
    }
    i++;
}

let lastIndex = arr.length - 1;
if ((arr[lastIndex] < startOfHour) && (lastIndex % 2 === 0)) { // if last transition time was --> deep work
    hourSumArr.push(startOfHour - arr[arr.length - 1])
}

const sum = hourSumArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

console.log(hourSumArr);
console.log(sum);

return sum;