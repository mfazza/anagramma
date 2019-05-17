const keys = require('../config/keys');
var MongoClient = require('mongodb').MongoClient;
const dbName = "test"
const colName = "words";

var uri = process.env.MONGODB_URI || keys.mongoURI;
console.log(uri);

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

var getMongo = exports.getMongo = () => {
    if (connection == null) {
        connect()
    }
    return connection;
}

exports.hashCode = String.prototype.hashCode = function () {
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        //        hash = hash & hash;
    }
    return hash;
}