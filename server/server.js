const express = require("express");
const servertools = require('./servertools');
const db = require('./servertools');
const operations = require('../routes/api/operations');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

var PORT = process.env.PORT || 5000; //if not running on heroku, use port 5000

//MongoDB connection
db.connect()
    .then(() => console.log('database connected'))
    .catch((e) => {
        console.error(e);
        // Always hard exit on a database connection error
        process.exit(1);
    });



app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});


//  POST route to insert a grandchild into the database
//  ARGS: json key value pair such as { "Taylor": 10000 } included in the body of the request
//  RES: 201 or 404 codes
//  Maps to 'insert' in ../routes/api/operations.js
app.post('/setup', operations.initialize);

//  GET route to retrieve the records for a particular grandchild
//  ARGS: specific grandchild as in /child/specificchild.json
//  RES: 200 -> { Name: Taylor, btc: 10, ... }
//  Maps to 'get' in ../routes/api/operations.js
app.get('/child/:child', operations.getRecordByName);


//  PUT route to register trades into the database
//  ARGS: specific grandchild as in /child/specificchild.json AND transaction in the body of the request
//app.put('/child/:child.json', operations.put);
app.put('/child/:child', operations.trade);

app.delete('/setup', operations.dropAll);

module.export = app;