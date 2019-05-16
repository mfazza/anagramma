const express = require("express");
const tools = require('./tools');
var corpus = {}

const app = express();
app.use(express.json());
var PORT = process.env.PORT || 3000;

//MongoDB connection
// const db = require('./mongomodule');
// db.connect()
//     .then(() => console.log('database connected'))
//     .catch((e) => {
//         console.error(e);
//         // Always hard exit on a database connection error
//         process.exit(1);
//     });


app.post('/words.json', (req, res) => {

    tools.postToCorpus(req.body.words, corpus)
    res.status(201).send({
        message: "Resource created: the words from the request have been added to the corpus."
    })
});

app.get('/build/words.json', (req, res) => {

    tools.postToMongoDBBInitial()

    res.status(201).send({
        message: "Resource created: the words from the request have been added to the corpus."
    })
});

app.get('/anagrams/:word.json', (req, res) => {

    if (req.query.limit != undefined && !(req.query.limit instanceof Object)) {
        res.status(200).send({
            anagrams: tools.getAnagrams(req.params.word, corpus).slice(0, req.query.limit)
        })
    } else {
        res.status(200).send({
            anagrams: tools.getAnagrams(req.params.word, corpus)
        })
    }

});

app.delete('/words/:word.json', (req, res) => {

    tools.deleteSingleWord(req.params.word, corpus)
    res.status(204).send()
})

app.delete('/words.json', (req, res) => {

    corpus = {}
    res.status(204).send()
});

app.get('/save/words.json', (req, res) => {

    tools.writeToFile(corpus)
    res.status(201).send()
})

app.get('/load/words.json', async (req, res) => {
    corpus = await tools.loadAllWords()
    res.status(201).send()
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});