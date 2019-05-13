//  A better approach to generating a unique hash for each word: it uses bitwise operations instead of prime factorization.
module.exports = String.prototype.hashCode = function () {

    var hash = 0;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
    }
    return hash;
}
