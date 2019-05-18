const express = require("express");
const servertools = require('./servertools');

const words = require('../routes/api/words');
const anagrams = require('../routes/api/anagrams');
const db = require('./servertools');
const stats = require('../routes/api/stats');


const app = express();
app.use(express.json());
var PORT = process.env.PORT || 3000;

//MongoDB connection
db.connect()
    .then(() => console.log('database connected'))
    .catch((e) => {
        console.error(e);
        // Always hard exit on a database connection error
        process.exit(1);
    });

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});



//  POST route to insert words into the corpus 
//  ARGS: json array such as{ "json": ["read", "dear", "dare"] } included in the body of the request
//  RES: 201 or 404 codes
//  Maps to 'insert' in ../routes/api/words.js
app.post('/words.json', words.insert);

//  DELETE route to delete all words from the corpus
//  ARGS: none
//  RES: 204 or 404 codes
//  Maps to 'dropAll in ../routes/api/words.js
app.delete('/words.json', words.dropAll);

//  DELETE route to delete all words from the corpus
//  ARGS: word to be deleted as in '/words/wordtobedeleted.json'
//  RES: 204 or 404 codes
//  Maps to 'dropOne in ../routes/api/words.js
app.delete('/words/:word.json', words.dropOne);



//  GET route to retrieve words with most anagrams
//  ARGS: none
//  RES: 200 -> { "Words with most anagrams": ['read', 'dare', 'dear'] } OR 404 code
//  Maps to 'most' in ../routes/api/anagrams.js
app.get('/anagrams/most.json', anagrams.most);

//  GET route to retrieve words with a certain minimum number of anagrams
//  ARGS: atleast parameter in url as in '/anagrams/minimum.json?atleast=2'
//  RES: 200 -> { "List of Anagrams matching the criteria": ['read', 'dare', 'dear'] } OR 404
//  Maps to 'wAtLeast' in ../routes/api/anagrams.js
app.get('/anagrams/minimumnumber.json', anagrams.wAtLeast); //atleast is the parameter

//  GET route to retrieve anagrams of an specific word it has options to limit the number of results and to exclude proper nouns
//  ARGS: specific word as in /anagrams/specificword.json
//  OPT ARGS: limit as in /anagrams/someword.json?limit=1 and proper as in /anagrams/someword.json?proper=1
//  RES: 200 -> { anagrams: ['read', 'dare', 'dear'] } OR 200 { anagrams: []}
//  Maps to 'get' in ../routes/api/anagrams.js
app.get('/anagrams/:word.json', anagrams.get);

//  POST route that returns wheter or not the words sent are anagrams of each other
//  ARGS: json array such as{ "json": ["read", "dear", "dare"] } included in the body of the request
//  RES: 200 -> { message: "The words sent are not all anagrams of each other." } OR 200 -> message: "The words sent are all anagrams of each other."
//  Maps to 'checkIfAnagrams' in ../routes/api/anagrams.js
app.post('/anagrams/words.json', anagrams.checkIfAnagrams);

//  DELETE route that deletes a word and all its matching anagrams
//  ARGS: word to have all itself and all its anagrams deleted as in '/anagrams/wordtobedeleted.json'
//  RES: 204 or 404 codes OR 404 -> { message: "Please, specify the word to be deleted along with all its anagrams."}
app.delete('/anagrams/:word.json', anagrams.dropMatchingAnagrams);


//  GET route to retrieve the total number of words in the corpus
//  ARGS: none
//  RES: 200 -> { "Total words": 6 } OR 404
app.get('/stats/total.json', stats.totalWords);

//  GET route to retrieve the average word length in the corpus
//  ARGS: none
//  RES: 200 -> { "Average word length": 6 } OR 404
app.get('/stats/average.json', stats.average);

//  GET route to retrieve the length of the smallest word in the corpus
//  ARGS: none
//  RES: 200 -> { "Minimum word length": 6, "Word": "a" } OR 404
app.get('/stats/min.json', stats.min);

//  GET route to retrieve the length of the biggest word in the corpus
//  ARGS: none
//  RES: 200 -> { "Maximum word length": 6, "Word": "pneumonoultramicroscopicsilicovolcanoconiosis" } OR 404
app.get('/stats/max.json', stats.max);