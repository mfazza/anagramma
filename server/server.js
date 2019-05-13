const express = require("express");

const app = express();
const PORT = 3000;

app.post('/words.json', (req, res) => {
    res.status(201).send({
        message: "Resource created"
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