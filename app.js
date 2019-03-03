"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var cors = require('cors');
var sqlite_js_1 = require("./sqlite.js");
var user_js_1 = require("./user.js");
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
function checkDataTypeDate(date) {
    //toDo check up on additional keys
    //toDo check realistic dates
    return (typeof date.day === 'number'
        && typeof date.month === 'number'
        && typeof date.year === 'number');
}
function checkDataTypeTransData(object) {
    //toDo check up on additional keys
    return (checkDataTypeDate(object.date)
        && typeof object.value === 'number'
        && typeof object.category === 'string'
        && checkDataTypeMedium(object.medium));
}
var db = new sqlite_js_1.Database();
var user = new user_js_1.User(db);
//convention: id = index
var testData = [{ id: 0, value: 6.97, date: { day: 9, month: 2, year: 2019 }, category: 'testing', medium: 'cash' }];
function fillData(array) {
    for (var i = 1; i < 20; i++) {
        var id = i;
        var value = Math.floor(Math.random() * 1000) / 100;
        var day = Math.floor(Math.random() * 28) + 1;
        var month = Math.floor(Math.random() * 12) + 1;
        var year = Math.floor(Math.random() * 19) + 2000;
        var date = { day: day, month: month, year: year };
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
        array.push({ id: id, value: value, date: date, category: category, medium: medium });
        //db.insert(value, `${date.year}-${date.month}-${date.year}`, category, medium);
    }
    return array;
}
fillData(testData);
//db.selectAll();
var dataRouter = express.Router();
var loginRouter = express.Router();
app.use('/data', dataRouter);
app.use('/login', loginRouter);
app.get('/login', function (req, res, next) {
    res.send("Hello Login!");
});
app.post('/login', function (req, res, next) {
    console.log(req.body);
    var name = req.body.name;
    var password = req.body.password;
    console.log(name, password);
    user.login(name, password)
        .then(function (success) {
        if (success) {
            console.log("login successful");
            res.sendStatus(200);
        }
        else {
            console.log("login failed");
            res.sendStatus(401);
        }
    })
        .catch(function (error) {
        console.error(error);
        res.send(500);
    });
});
app.post('/register', function (req, res, _next) {
    console.log(req.body);
    var name = req.body.name;
    var password = req.body.password;
    user.create(name, password)
        .then(function (success) {
        if (success)
            res.sendStatus(200);
        else { }
    })
        .catch(function (error) { console.error(error); res.sendStatus(500); });
});
dataRouter.get('/', function (_req, res, _next) {
    res.send(testData);
});
app.get('/data/:id', function (req, res, _next) {
    if (testData[req.params.id]) {
        res.send(testData[req.params.id]);
    }
    else {
        res.status(404).send();
    }
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
dataRouter.delete('/:id', function (req, res, _next) {
    var id = req.params.id;
    if (testData[id]) {
        delete testData[id];
        res.status(204).send();
    }
    else {
        res.status(400).send();
    }
});
app.listen(PORT, function () {
    console.log("Server is listening to port " + PORT);
});
