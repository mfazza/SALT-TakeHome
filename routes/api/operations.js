const db = require('../../server/servertools');
const initialDocument = require('../../config/initialDocument');

/* All functions follow the same model: they return a promise upon performing a CRUD operation in the database. */

function postToMongoDB() {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).insertMany(initialDocument, { upsert: true, returnOriginal: false }, function (err, res) { err ? reject(err) : resolve(res); }
        )
    })
}

function deleteAll() {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).drop(
            function (err, res) { err ? reject(err) : resolve(res); }
        )
    }
    )
}

function queryByName(query) {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).findOne(query, function (err, res) { err ? reject(err) : resolve(res); }
        )
    })
}

//where c1 = coin1 and a1 = new ammount 1
function tradeCoin(query, c1, c2, a1, a2) {
    return new Promise(function (resolve, reject) {
        db.getMongo().db(db.dbName).collection(db.colName).findOneAndUpdate(
            query,
            { $set: { [c1]: a1, [c2]: a2 } },
            { returnOriginal: false },
            function (err, res) { err ? reject(err) : resolve(res); }
        )
    })
}

exports.initialize = (req, res) => {
    postToMongoDB().then(() => { res.status(201).send({ message: "The database has been initialized" }) })
        .catch(err => { res.status(404).send() })
};

exports.dropAll = (req, res) => {
    deleteAll()
        .then(res.status(204).send())
        .catch(err => res.status(404).send())
}

exports.getRecordByName = (req, res) => {
    let name = req.params.child;
    queryByName({ "name": name })
        .then((resolution) => res.status(200).send(resolution))
        .catch(err => res.status(200).send())
}

exports.trade = (req, res) => {

    let name = req.params.child;
    let coin1 = req.body.coin1
    let coin2 = req.body.coin2
    let newAmount1 = req.body.amount1
    let newAmount2 = req.body.amount2

    tradeCoin({ "name": name }, coin1, coin2, newAmount1, newAmount2)
        .then((resolution) => res.status(200).send(resolution["value"]))
        .catch(err => res.status(200).send())
}