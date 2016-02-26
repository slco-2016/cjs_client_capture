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
var creds = require("./creds.js")
var conString = "postgres://" + creds.user + ":" + creds.password + "@" + creds.host + ":5432/" + creds.database;
var client = new pg.Client(conString);
client.connect();


app.get("/", function (req, res) {
	res.render("index");
});

app.post("/", function (req, res) {
	res.render("index");
});


var port = 8080;
app.listen(port, function () { console.log("Listening on port", port); });