const express = require("express");
const servertools = require('./servertools');

const words = require('../routes/api/words');
const anagrams = require('../routes/api/anagrams');
const db = require('./servertools');


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

app.post('/words.json', words.insert);
app.delete('/words.json', words.dropAll);
app.delete('/words/:word.json', words.dropOne);

app.get('/anagrams/most.json', anagrams.most);
app.get('/anagrams/minimum.json', anagrams.wAtLeast); //atleast is the parameter
app.get('/anagrams/:word.json', anagrams.get);
app.post('/anagrams/words.json', anagrams.checkIfAnagrams);
app.delete('/anagrams/:word.json', anagrams.dropMatchingAnagrams);


