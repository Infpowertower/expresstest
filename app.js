"use strict";
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var postgres_js_1 = require("./postgres.js");
var app = express();
app.use(express.json());
var PORT = 8001;
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
function checkDataTypeMedium(string) {
    return (string === 'cash'
        || string === 'bank'
        || string === 'stock');
}
//User Defined Type Guards
/*function checkDataTypeDate(date: any): date is Date {
  //toDo check up on additional keys
  //toDo check realistic dates
  return (
    typeof date.day === 'number'
    && typeof date.month === 'number'
    && typeof date.year === 'number'
  )
}

function checkDataTypeTransData(object: any): object is transData {
  //toDo check up on additional keys
  return (
    checkDataTypeDate(object.date)
    && typeof object.value === 'number'
    && typeof object.category === 'string'
    && checkDataTypeMedium(object.medium)
  );
}*/
var db = new postgres_js_1.database();
//convention: id = index
var testData = { columns: [{ id: 'number' }, { value: 'number' }, { date: 'date' }, { category: 'string' }, { medium: 'string' }], data: [[0, 6.97, { day: 9, month: 2, year: 2019 }, 'testing', 'cash']] };
function fillData() {
    for (var i = 1; i < 20; i++) {
        var id = i;
        var value = Math.floor(Math.random() * 1000) / 100;
        var day = Math.floor(Math.random() * 28) + 1;
        var month = Math.floor(Math.random() * 12) + 1;
        var year = Math.floor(Math.random() * 19) + 2000;
        var date = [day, month, year];
        var category = 'testing';
        var randomValue = Math.floor(Math.random() * 3);
        var medium = void 0;
        if (randomValue === 0) {
            medium = 'cash';
        }
        else if (randomValue === 1) {
            medium = 'bank';
        }
        else {
            medium = 'stock';
        }
        testData.data.push([id, value, date, category, medium]);
        db.insert(value, date.year + "-" + date.month + "-" + date.year, category, medium);
    }
}
fillData();
db.selectAll();
app.get('/data/:id', function (req, res, _next) {
    if (testData[req.params.id]) {
        res.send(testData[req.params.id]);
    }
    else {
        res.status(404).send();
    }
});
var dataRouter = express.Router();
app.use('/data', dataRouter);
dataRouter.get('/', function (_req, res, _next) {
    res.send(testData);
});
dataRouter.put('/:id', function (req, res, _next) {
    var id = req.params.id;
    if (testData[id]) {
        var query = req.query;
        console.log(query);
        //(<any>Object ist notwendig, da Typescript assign ansonsten nicht anerkennt)
        //https://stackoverflow.com/questions/38860161/using-typescript-and-object-assign-gives-me-an-error-property-assign-does-no
        var result = Object.assign(testData[id], query);
        console.log(result);
        testData[id] = result;
        res.status(201).send(req.params.id);
    }
    else {
        console.log(req.query);
        res.status(404).send();
    }
});
dataRouter.post('/', function (req, res, _next) {
    var id = testData.length;
    var result = req.body;
    result.id = id;
    if (checkDataTypeTransData(result)) {
        testData.push(result);
        res.status(201).send(id.toString()); //toString because of bug in express
    }
    else {
        res.status(400).send();
    }
});
dataRouter["delete"]('/:id', function (req, res, _next) {
    var id = req.params.id;
    if (testData[id]) {
        delete testData[id];
        res.status(204).send();
    }
    else {
        res.status(400).send();
    }
});
app.get('/:name', function (req, res, _next) {
    res.send("Hello " + req.params.name);
});
app.get('/', function (_req, res, _next) {
    res.send("Hello world!");
});
app.listen(PORT, function () {
    console.log("Server is listening to port " + PORT);
});
