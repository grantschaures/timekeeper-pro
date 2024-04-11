let answer = twoSum([2,7,11,15], 9);
console.log(answer);

// function twoSum(nums, target) {
//     const numMap = new Map();

//     for (let i = 0; i < nums.length; i++) {
//         const complement = target - nums[i];
//         if (numMap.has(complement)) {
//             return [numMap.get(complement), i];
//         }
//         numMap.set(nums[i], i);
//     }
    
//     return [];
// }

function twoSum(nums, target) {
    let numObj = {};

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (complement in numObj) {
            return [numObj[complement], i];
        }
        numObj[nums[i]] = i;
    }

    return [];
}