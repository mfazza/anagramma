const uri = require('../config/keys').mongoURI;
var MongoClient = require('mongodb').MongoClient;
const dbName = "test"
const colName = "words";


let connection = null;

var options = {
    db: {
        numberOfRetries: 2
    },
    server: {
        auto_reconnect: true,
        poolSize: 40,
        socketOptions: {
            connectTimeoutMS: 500
        }
    },
    replSet: {},
    mongos: {}
};

module.exports.connect = () => new Promise((resolve, reject) => {
    MongoClient.connect(uri, options, function (err, db) {
        if (err) { reject(err); return; };
        resolve(db);
        connection = db;
    });
});

var getMongo = exports.getMongo = () => {
    if (connection == null) {
        connect()
    }
    return connection;
}


var queryMongoDB = exports.queryMongoDB = function (query) {
    return new Promise(function (resolve, reject) {
        getMongo().db(dbName).collection(colName).find(query).toArray(

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

exports.postToMongoDB = async function (wordsFromReq) {

    for (var i = 0; i < wordsFromReq.length; i++) {
        let currentWord = wordsFromReq[i];
        let currentHash = currentWord.toLowerCase().split("").sort().join("").hashCode()

        res = await queryMongoDB({ "hash": currentHash });

        if ((res === undefined || res.length == 0)) {
            getMongo().db(dbName).collection(colName).insertOne({ "hash": currentHash, "anagrams": [currentWord] }, (err, res) => { if (err) throw err });
        } else if (!(res[0]["anagrams"].some(word => word === currentWord))) {
            getMongo().db(dbName).collection(colName).updateOne({ "hash": currentHash }, { $push: { "anagrams": currentWord } }, (err, res) => {
                if (err) {
                    console.log("This is the key: " + currentHash + " and this is the word: " + currentWord);
                    throw err
                }
            })
        }


    }
}


exports.deleteAll = function () {
    return new Promise(function (resolve, reject) {
        getMongo().db(dbName).collection(colName).drop(
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

exports.deleteSingleWord = function (wordFromReq) {
    let currentWord = wordFromReq;
    let currentHash = currentWord.toLowerCase().split("").sort().join("").hashCode()

    return new Promise(function (resolve, reject) {
        getMongo().db(dbName).collection(colName).findOneAndUpdate({ "hash": currentHash }, { $pull: { "anagrams": currentWord } }, function (err, res) {
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })

}

exports.getMostAnagrams = function () {

    return new Promise(function (resolve, reject) {
        getMongo().db(dbName).collection(colName).aggregate([
            {
                '$project': {
                    'aSize': {
                        '$size': '$anagrams'
                    },
                    'anagrams': '$anagrams'
                }
            }, {
                '$sort': {
                    'aSize': -1
                }
            }, {
                '$limit': 1
            }
        ]).toArray(

            function (err, res) {
                if (err) {
                    return reject(err)
                }
                return resolve(res)
            }
        )
    })

}

exports.getAnagramsWithAtLeast = function (atLeast) {

    let findField = "anagrams." + atLeast
    return new Promise(function (resolve, reject) {
        getMongo().db(dbName).collection(colName).find({ [findField]: { $exists: true } }, { fields: { _id: 0, hash: 0 } }

        ).toArray(

            function (err, res) {
                if (err) {
                    return reject(err)
                }
                return resolve(res)
            }
        )
    })
}

exports.deleteWordAndAnagrams = function (wordFromReq) {
    let currentWord = wordFromReq;
    let currentHash = currentWord.toLowerCase().split("").sort().join("").hashCode()

    return new Promise(function (resolve, reject) {
        getMongo().db(dbName).collection(colName).findOneAndDelete({ "hash": currentHash }, function (err, res) {
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })

}














