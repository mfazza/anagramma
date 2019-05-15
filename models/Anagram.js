const mongoose = require('mongoodse');
const Schema = mongoose.Schema;

const AnagramSchema = new Schema({
    hash: number,
    anagrams: [String]
});

module.exports = Anagram = mongoose.model('anagram', AnagramSchema);