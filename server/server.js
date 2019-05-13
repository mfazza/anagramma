const express = require("express");
const tools = require('./tools');
var corpus = {}

const app = express();
app.use(express.json());
const PORT = 3000;


app.post('/words.json', (req, res) => {

    //error handling: if req.body.words is undefined, handle it
    //Invoking functions using JS objects passes by reference
    tools.postToCorpus(req.body.words, corpus)

    res.status(201).send({
        message: "Resource creat",
        corpus: corpus
    })
});

app.get('/anagrams/:word.json', (req, res) => {
    res.status(200).send({
        words: ["word1", "word2", "word3"],
        query: req.params.word
    })
});

app.delete('/words/:word.json', (req, res) => {
    res.status(200).send({
        result: "resource deleted"
    })
})

app.delete('/words.json', (req, res) => {
    res.status(200).send({
        result: "Deleted all words from corpus"
    })
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});