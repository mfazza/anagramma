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
    let combination = wordFromReq.unscramble()

    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).findOneAndUpdate({ "combination": combination }, { $pull: { "anagrams": wordFromReq } }, function (err, res) {
            err ? reject(err) : resolve(res);
        })
    })

}

exports.insert = async (req, res) => {

    for (var i = 0; i < req.body.words.length; i++) {
        let combination = req.body.words[i].unscramble()

        await postToMongoDB(req.body.words[i], { "combination": combination })
            .then(() => { })
            .catch(err => {
                console.log(err)
                console.log(req.body.words[i] + " was not inserted properly")
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