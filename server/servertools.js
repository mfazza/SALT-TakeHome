const keys = require('../config/keys');
var MongoClient = require('mongodb').MongoClient;

const dbName = "SALT"
const colName = "test";
exports.dbName = dbName;
exports.colName = colName

var uri = process.env.MONGODB_URI || keys.mongoURI;

let connection = null;

var options = {
    poolSize: 10,
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
