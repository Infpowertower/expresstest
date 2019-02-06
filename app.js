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
app.get('/:name', function (req, res, _next) {
    res.send("Hello " + req.params.name);
});
app.get('/', function (_req, res, _next) {
    res.send("Hello world!");
});
app.listen(PORT, function () {
    console.log("Server is listening to port " + PORT);
});
