//This is the first implementation of the hashing algorithm.  However, the amount of multiplications was too large to be fast.  This requires the creation of an object and prime factorization.  It would be much faster to take advantage of Javascript's charCodeAt() function and use bitwise operations to achieve a hash.
const allChars = { "a": 3, "b": 5, "c": 7, "d": 11, "e": 13, "f": 17, "g": 19, "h": 23, "i": 29, "j": 31, "k": 37, "l": 41, "m": 43, "n": 47, "o": 53, "p": 59, "q": 61, "r": 67, "s": 71, "t": 73, "u": 79, "v": 83, "w": 89, "x": 97, "y": 101, "z": 103 };


function findKey(word) {
    let lowerCased = word.toLowerCase()
    let result = 1;
    for (var i = 0; i < lowerCased.length; i++) {
        result *= allChars[lowerCased.charAt(i)]
    }

    return result;
}