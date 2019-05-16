const express = require("express");
const tools = require('./tools');
var corpus = {}

const app = express();
app.use(express.json());
var PORT = process.env.PORT || 3000;

//MongoDB connection
const db = require('./mongotools');
db.connect()
    .then(() => console.log('database connected'))
    .catch((e) => {
        console.error(e);
        // Always hard exit on a database connection error
        process.exit(1);
    });

//  @POST route for corpus
app.post('/words.json', (req, res) => {

    tools.postToCorpus(req.body.words, corpus)
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

//general purpose routes
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


//  routes for MongoDB
//  @POST route for mongo
app.post('/m/words.json', (req, res) => {

    db.postToMongoDB(req.body.words).then(() => res.status(201).send(req.body.words + " have been added"))
        .catch(err => console.log(err))
    //db.postToMongoDB2(req.body.words)
});

//  @GET all anagrams for a particular word
app.get('/m/anagrams/:word.json', (req, res) => {

    console.log(req.query);


    if (req.query.limit != undefined && !(req.query.limit instanceof Object)) {
        let wordHash = req.params.word.toLowerCase().split("").sort().join("").hashCode()
        db.queryMongoDB({ "hash": wordHash })
            .then((resolution) => res.status(200).send({ anagrams: resolution[0]['anagrams'].slice(0, req.query.limit) }))
            .catch(err => {
                console.log(err)
                res.status(404).send({ anagrams: [] })
            })
    } else {
        let wordHash = req.params.word.toLowerCase().split("").sort().join("").hashCode()
        db.queryMongoDB({ "hash": wordHash })
            .then((resolution) => res.status(200).send({ anagrams: resolution[0]['anagrams'] }))
            .catch(err => {
                console.log(err)
                res.status(404).send({ anagrams: [] })
            })
    }
});

// @DELETE route for MongoDB
app.delete('/m/words.json', (req, res) => {

    db.deleteAll()
        .then((res.status(200).send()))
        .catch(err => res.status(404).send())
});

//@DELETE single word from MongoDB
app.delete('/m/words/:word.json', (req, res) => {

    db.deleteSingleWord(req.params.word)
        .then((res.status(200).send()))
        .catch(err => res.status(404).send())
})