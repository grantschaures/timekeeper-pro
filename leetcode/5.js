/**
 * @param {string} s
 * @return {string}
 */

// s --> "hanah"

var longestPalindrome = function(s) {
    // returning empty string if s is NULL
    if (!s) {
        return "";
    }

    function expandAroundCenter(s, left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    }

    let start = 0; // beginning index
    let end = 0; //end index - 1

    for (let i = 0; i < s.length; i++) {
        const odd = expandAroundCenter(s, i, i); // 1
        const even = expandAroundCenter(s, i, i + 1); // 0
        const max_len = Math.max(odd, even);

        if (max_len > end - start) {
            start = i - Math.floor((max_len - 1) / 2);
            end = i + Math.floor(max_len / 2);
        }
    }

    return s.substring(start, end + 1);    
};

console.log(longestPalindrome("hannah"));