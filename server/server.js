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

//  @GET words with most anagrams
app.get('/m/anagrams/most/words.json', (req, res) => {

    db.getMostAnagrams()
        .then((resolution) => res.status(200).send({ "Words with most anagrams": resolution[0]['anagrams'] }))
        .catch(err => {
            console.log(err)
            res.status(404).send({ "Words with most anagrams": [] })
        })

})

app.get('/m/anagrams/atleast/words.json', (req, res) => {

    if (req.query.atleast != undefined) {
        db.getAnagramsWithAtLeast(req.query.atleast - 1)
            .then((resolution) => res.status(200).send({ "List of Anagrams matching the criteria": resolution }))
            .catch(err => {
                console.log(err)
                res.status(404).send({ message: "Your request was not completed successfully" })
            })
    } else {
        res.status(404).send({
            message: "Please specify the minimum number of anagrams with ?atleast=number"
        })
    }

})

app.delete('/m/anagrams/deleteSimilar/:word.json', (req, res) => {

    if (req.params.word != undefined) {
        db.deleteWordAndAnagrams(req.params.word)
            .then(() => res.status(200).send({ message: "Your request was completed successfully" }))
            .catch(err => {
                console.log(err)
                res.status(404).send({ message: "Your request was not completed successfully" })
            })
    } else {
        res.status(404).send({
            message: "Please, specify the word to be deleted along with all its anagrams."
        })
    }

})

//  @POST determine if all words are anagrams of each other
app.post('/anagrams/check/words.json', (req, res) => {

    var hash = 0;

    for (var i = 0; i < req.body.words.length; i++) {
        let currentWord = req.body.words[i];
        let currentHash = currentWord.toLowerCase().split("").sort().join("").hashCode()


        if (i != 0 && currentHash != hash) {
            res.status(200).send({ message: "The words sent are not all anagrams of each other." })
            break;
        }
        hash = currentHash;
    }
    res.status(200).send({ message: "The words sent are all anagrams of each other." })
})

//  @GET all anagrams for a particular word
//  Note that & won't work with curl
app.get('/m/anagrams/:word.json', (req, res) => {

    let wordHash = req.params.word.toLowerCase().split("").sort().join("").hashCode()

    if (req.query.limit != undefined && req.query.proper != undefined) {
        db.queryMongoDB({ "hash": wordHash })
            .then((resolution) => res.status(200).send({
                anagrams: resolution[0]['anagrams'].filter(function (word) { return word === word.toLowerCase(); }).slice(0, req.query.limit)
            }))
            .catch(err => {
                console.log(err)
                res.status(404).send({ anagrams: [] })
            })
    } else if (req.query.limit != undefined) {
        db.queryMongoDB({ "hash": wordHash })
            .then((resolution) => res.status(200).send({ anagrams: resolution[0]['anagrams'].slice(0, req.query.limit) }))
            .catch(err => {
                console.log(err)
                res.status(404).send({ anagrams: [] })
            })
    } else if (req.query.proper != undefined) {
        db.queryMongoDB({ "hash": wordHash })
            .then((resolution) => res.status(200).send({
                anagrams: resolution[0]['anagrams'].filter(function (word) { return word === word.toLowerCase(); })
            }))
            .catch(err => {
                console.log(err)
                res.status(404).send({ anagrams: [] })
            })
    } else {
        db.queryMongoDB({ "hash": wordHash })
            .then((resolution) => res.status(200).send({ anagrams: resolution[0]['anagrams'] }))
            .catch(err => {
                console.log(err)
                res.status(404).send({ anagrams: [] })
            })
    }
});