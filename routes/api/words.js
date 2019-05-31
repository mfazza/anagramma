const db = require('../../server/servertools');

/* All functions follow the same model: they return a promise upon performing a CRUD operation in the database. */

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

/*  Each function below, receives req from the endpoint described in server.js,
    then they call one of the functions above.  The functions above return promises.
    Upon receiving the promise resolution, they'll return the HTTP status code along with a response.
*/

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

exports.dropAll = async (req, res) => {
    await deleteAll()
        .then((res.status(204).send()))
        .catch(err => res.status(404).send())
}

exports.dropOne = (req, res) => {
    console.log(req.params.word);
    deleteSingleWord(req.params.word)
        .then((res.status(204).send()))
        .catch(err => res.status(404).send())
}