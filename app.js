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

app.post("/new_entry", function (req, res) {
	var b = {};
	b.first = req.body.first,
  b.middle = req.body.middle,
  b.last = req.body.last,
  b.gender = req.body.gender,
  b.year = req.body.year,
  b.month = req.body.month,
  b.day = req.body.day,
  b.charge_lvl = req.body.charge_lvl,
  b.offense_1 = req.body.offense_1,
  b.offense_2 = req.body.offense_2,
  b.offense_3 = req.body.offense_3,
  b.case_num = req.body.case_num,
  b.otn = req.body.otn,
  b.so = req.body.so,
  b.officer_id = req.body.officer_id,
  b.notes = req.body.notes;

  // make sure required variables are included
  var ok = true;
  if ( !(b.first && (b.first.length >= 1)) ) ok = false;
  if ( !(b.last && (b.last.length >= 1)) ) ok = false;

  if (ok) {
  	res.send("Succesful entry. <a href='/new_entry'>Return to entry page.</a>")
  } else {
  	res.send("Missing required entries. <a href='/new_entry'>Try again.</a>")
  }
});


var port = 8080;
app.listen(port, function () { console.log("Listening on port", port); });