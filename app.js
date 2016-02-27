// app initialization
var express = require("express");
var app = express();

// dependencies
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// database
var pg = require("pg");
var db  = require("./db");


app.get("/", function (req, res) {
	res.render("index");
});

app.get("/new_entry", function (req, res) {
	res.render("entry");
});

app.post("/", function (req, res) {
	res.render("index");
});


var port = 8080;
app.listen(port, function () { console.log("Listening on port", port); });