const db = require('../../server/servertools');

const dbName = "test"
const colName = "words";

function getMostAnagrams() {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(dbName).collection(colName).aggregate([
            { '$project': { 'aSize': { '$size': '$anagrams' }, 'anagrams': '$anagrams' } }
            , { '$sort': { 'aSize': -1 } },
            { '$limit': 1 }
        ]).toArray(
            function (err, res) {
                err ? reject(err) : resolve(res);
            }
        )
    })
}

function getAnagramsWithAtLeast(atLeast) {

    let findField = "anagrams." + atLeast
    return new Promise(function (resolve, reject) {
        db.getMongo().db(dbName).collection(colName).find({ [findField]: { $exists: true } }, { fields: { _id: 0, hash: 0 } }
        ).toArray(
            function (err, res) {
                err ? reject(err) : resolve(res);
            }
        )
    })
}

var queryMongoDB = exports.queryMongoDB = function (query) {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(dbName).collection(colName).find(query).toArray(

            function (err, res) {
                if (err) {
                    return reject(err)
                }
                return resolve(res)
            }
        )
    }
    )
}

function deleteWordAndAnagrams(wordFromReq) {
    let currentWord = wordFromReq;
    let currentHash = currentWord.toLowerCase().split("").sort().join("").hashCode()

    return new Promise(function (resolve, reject) {
        db.getMongo().db(dbName).collection(colName).findOneAndDelete({ "hash": currentHash }, function (err, res) {
            err ? reject(err) : resolve(res);
        })
    })

}

exports.most = (req, res) => {
    getMostAnagrams()
        .then((resolution) => res.status(200).send({ "Words with most anagrams": resolution[0]['anagrams'] }))
        .catch(err => {
            console.log(err)
            res.status(404).send()
        })
}

exports.wAtLeast = (req, res) => {
    if (req.query.atleast != undefined) {
        getAnagramsWithAtLeast(req.query.atleast - 1)
            .then((resolution) => res.status(200).send({ "List of Anagrams matching the criteria": resolution }))
            .catch(err => res.status(404).send({ message: "Your request was not completed successfully" }))
    } else {
        res.status(404).send({
            message: "Please specify the minimum number of anagrams with ?atleast=number"
        })
    }
}

exports.get = (req, res) => {

    let wordHash = req.params.word.toLowerCase().split("").sort().join("").hashCode()

    if (req.query.limit != undefined && req.query.proper != undefined) {
        queryMongoDB({ "hash": wordHash })
            .then((resolution) => res.status(200).send({
                anagrams: resolution[0]['anagrams'].filter(function (word) { return word === word.toLowerCase(); }).slice(0, req.query.limit).sort()
            }))
            .catch(err => {
                console.log(err)
                res.status(200).send({ anagrams: [] })
            })
    } else if (req.query.limit != undefined) {
        queryMongoDB({ "hash": wordHash })
            .then((resolution) => res.status(200).send({ anagrams: resolution[0]['anagrams'].slice(0, req.query.limit).sort() }))
            .catch(err => {
                console.log(err)
                res.status(200).send({ anagrams: [] })
            })
    } else if (req.query.proper != undefined) {
        queryMongoDB({ "hash": wordHash })
            .then((resolution) => res.status(200).send({
                anagrams: resolution[0]['anagrams'].filter(function (word) { return word === word.toLowerCase(); }).sort()
            }))
            .catch(err => {
                console.log(err)
                res.status(200).send({ anagrams: [] })
            })
    } else {
        queryMongoDB({ "hash": wordHash })
            .then((resolution) => res.status(200).send({ anagrams: resolution[0]['anagrams'].sort() }))
            .catch(err => {
                console.log(err)
                res.status(200).send({ anagrams: [] })
            })
    }
}

exports.dropMatchingAnagrams = (req, res) => {

    if (req.params.word != undefined) {
        deleteWordAndAnagrams(req.params.word)
            .then((res.status(204).send()))
            .catch(err => res.status(404).send())
    } else {
        res.status(404).send({
            message: "Please, specify the word to be deleted along with all its anagrams."
        })
    }

}

exports.checkIfAnagrams = (req, res) => {
    //rewrite with try catch to add 404
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
}