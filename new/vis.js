var string = "quick brown fox always jumps over a lazy dog.";

var count = 0;

for (let i = 0; i < string.length; i++) {
    if (isVowel(string[i]))
        count++;
}

console.log(count);

function isVowel(c) {

    switch(c) {
        case "a": 
        case "e":
        case "i":
        case "o":
        case "u":
            return true;
        default:
            return false;
    }
}