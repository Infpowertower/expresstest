"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var PORT = 8001;
//convention: id = index
var testData = [{ id: 0, value: 6.97, category: 'testing', medium: 'cash' }];
function fillData(array) {
    for (var i = 1; i < 20; i++) {
        var id = i;
        var value = Math.floor(Math.random() * 1000) / 100;
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
        array.push({ id: id, value: value, category: category, medium: medium });
    }
    return array;
}
fillData(testData);
app.get('/data/:id', function (req, res, _next) {
    if (testData[req.params.id]) {
        res.send(testData[req.params.id]);
    }
    else {
        res.status(404).send();
    }
});
app.get('/data', function (_req, res, _next) {
    res.send(testData);
});
app.put('/data/:id', function (req, res, _next) {
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
app.post('/data', function (req, res, _next) {
    var id = testData.length;
    var result = req.query;
    result.id = id;
    testData.push(result);
    res.status(201).send(id.toString()); //bug in express
});
app["delete"]('/data/:id', function (req, res, _next) {
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
