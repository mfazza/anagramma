const db = require('../../server/servertools');

/* All functions follow the same model: they return a promise upon performing a CRUD operation in the database. */

function getMostAnagrams() {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).aggregate([
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
        db.getMongo().db(db.dbName).collection(db.colName).find({ [findField]: { $exists: true } }, { fields: { _id: 0, hash: 0 } }
        ).toArray(
            function (err, res) {
                err ? reject(err) : resolve(res);
            }
        )
    })
}

var queryMongoDB = exports.queryMongoDB = function (query) {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).find(query).toArray(
            function (err, res) {
                err ? reject(err) : resolve(res);
            }
        )
    }
    )
}

function deleteWordAndAnagrams(wordFromReq) {
    let combination = wordFromReq.unscramble()

    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).findOneAndDelete({ "combination": combination }, function (err, res) {
            err ? reject(err) : resolve(res);
        })
    })

}

/*  Each function below, receives req from the endpoint described in server.js,
    then they call one of the functions above.  The functions above return promises.
    Upon receiving the promise resolution, they'll return the HTTP status code along with a response.
*/

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

    let combination = req.params.word.unscramble()

    //if limit exits and proper exists: limit the size and remove proper nouns from response
    //else if limit exists: limit the size of the response
    //else if proper exists: remove all proper nouns from response
    //else send a regular response

    if (req.query.limit != undefined && req.query.proper != undefined) {
        queryMongoDB({ "combination": combination })
            .then((resolution) => res.status(200).send({
                anagrams: resolution[0]['anagrams'].slice(0, req.query.limit).sort().filter(function (word) { return word === word.toLowerCase(); })
            }))
            .catch(err => {
                console.log(err)
                res.status(200).send({ anagrams: [] })
            })
    } else if (req.query.limit != undefined) {
        queryMongoDB({ "combination": combination })
            .then((resolution) => res.status(200).send({ anagrams: resolution[0]['anagrams'].slice(0, req.query.limit).sort() }))
            .catch(err => {
                console.log(err)
                res.status(200).send({ anagrams: [] })
            })
    } else if (req.query.proper != undefined) {
        queryMongoDB({ "combination": combination })
            .then((resolution) => res.status(200).send({
                anagrams: resolution[0]['anagrams'].filter(function (word) { return word === word.toLowerCase(); }).sort()
            }))
            .catch(err => {
                console.log(err)
                res.status(200).send({ anagrams: [] })
            })
    } else {
        queryMongoDB({ "combination": combination })
            .then((resolution) => res.status(200).send({ anagrams: resolution[0]['anagrams'].sort() }))
            .catch(err => {
                // console.log(err)
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
    var comb = "";
    for (var i = 0; i < req.body.words.length; i++) {
        let combination = req.body.words[i].unscramble()

        if (i != 0 && combination != comb) {
            res.status(200).send({ message: "The words sent are not all anagrams of each other." })
            break;
        }
        comb = combination;
    }
    res.status(200).send({ message: "The words sent are all anagrams of each other." })
}