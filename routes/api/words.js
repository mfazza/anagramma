const db = require('../../server/servertools');

function postToMongoDB(wordFromReq, query) {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).findOneAndUpdate(query, { $addToSet: { "anagrams": wordFromReq }, }, { upsert: true, returnOriginal: false }, function (err, res) {
            err ? reject(err) : resolve(res);
        }
        )
    }
    )
}

function deleteAll() {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).drop(
            function (err, res) {
                err ? reject(err) : resolve(res);
            }
        )
    }
    )
}

function deleteSingleWord(wordFromReq) {
    let currentWord = wordFromReq;
    let currentHash = currentWord.toLowerCase().split("").sort().join("").hashCode()

    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).findOneAndUpdate({ "hash": currentHash }, { $pull: { "anagrams": currentWord } }, function (err, res) {
            err ? reject(err) : resolve(res);
        })
    })

}

exports.insert = async (req, res) => {

    for (var i = 0; i < req.body.words.length; i++) {
        let currentWord = req.body.words[i];
        let currentHash = currentWord.toLowerCase().split("").sort().join("").hashCode()

        await postToMongoDB(currentWord, { "hash": currentHash })
            .then(() => { })
            .catch(err => {
                console.log(err)
                console.log(currentWord + " was not inserted properly")
                res.status(404).send()
            })
    }
    res.status(201).send();
};

exports.dropAll = (req, res) => {
    deleteAll()
        .then((res.status(204).send()))
        .catch(err => res.status(404).send())
}

exports.dropOne = (req, res) => {
    console.log(req.params.word);
    deleteSingleWord(req.params.word)
        .then((res.status(204).send()))
        .catch(err => res.status(404).send())
}