const uri = require('../config/keys').mongoURI1;
var MongoClient = require('mongodb').MongoClient;

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

module.exports.getMongo = () => {
    if (connection == null) {
        connect()
    }
    return connection;
}

var queryMongoDB = exports.queryMongoDB = function (query) {
    return new Promise(function (resolve, reject) {
        mongoModule.getMongo().db('test').collection('words4').find(query).toArray(

            function (err, res) {
                if (err) {
                    // Reject the Promise with an error
                    return reject(err)
                }
                // Resolve (or fulfill) the promise with data
                return resolve(res)
            }
        )
    }
    )
}

exports.postToMongoDBBInitial = function () {


    var datastore = JSON.parse(fs.readFileSync('/Users/MattFazza/Code/ibotta/data/datastore.json'));

    Object.keys(datastore).forEach(function (key) {
        mongoModule.getMongo().db('test').collection('xxwords').insertOne({ "hash": key, "anagrams": datastore[key] }, (err, res) => {
            if (err) {
                console.log("This is the key: " + key + " and this is the word: " + datastore[key]);
                throw err
            }
        })
    })

    console.log("I'm done");
}

exports.postToMongoDB = async function (wordsFromReq) {

    for (var i = 0; i < wordsFromReq.length; i++) {
        let currentWord = wordsFromReq[i];
        let currentHash = currentWord.toLowerCase().split("").sort().join("").hashCode()

        res = await queryMongoDB({ "hash": currentHash });

        if ((res === undefined || res.length == 0)) {
            mongoModule.getMongo().db('test').collection('words').insertOne({ "hash": currentHash, "anagrams": [currentWord] }, (err, res) => { if (err) throw err });
        } else if (!(res[0]["anagrams"].some(word => word === currentWord))) {
            mongoModule.getMongo().db('test').collection('words').updateOne({ "hash": currentHash }, { $push: { "anagrams": currentWord } }, (err, res) => {
                if (err) {
                    console.log("This is the key: " + currentHash + " and this is the word: " + currentWord);
                    throw err
                }
            })
        }


    }
}