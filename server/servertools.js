const keys = require('../config/keys');
var MongoClient = require('mongodb').MongoClient;

const dbName = "test"
const colName = "words";
exports.dbName = dbName;
exports.colName = colName

var uri = process.env.MONGODB_URI || keys.mongoURI;

let connection = null;

var options = {
    poolSize: 50,
    reconnectTries: 2,
    auto_reconnect: true,
    connectTimeoutMS: 500,
    useNewUrlParser: true
};

module.exports.connect = () => new Promise((resolve, reject) => {
    MongoClient.connect(uri, options, function (err, db) {
        if (err) { reject(err); return; };
        resolve(db);
        connection = db;
    });
});

//instead of creating a connection for every operation, the getMongo() function will return an instance of the connection pool
var getMongo = exports.getMongo = () => {
    if (connection == null) {
        connect()
    }
    return connection;
}

//added this method as part of string prototype to make the application more readable. This is the function that unscrambles the words.  I.E.: "radar".unscramble() == "aadrr"
exports.unscramble = String.prototype.unscramble = function () {
    return this.toLowerCase().split("").sort().join("")
}