// app initialization
var express = require("express");
var app = express();

// dependencies
var session = require("express-session");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set("view engine", "ejs");

// passport sessions and user management
var passport = require("passport");
require('./config/passport')(passport);

app.use(session({secret: "temporary"}));
app.use(passport.initialize());
app.use(passport.session());

// establish database connection
var db = require("./db");

// routes
require("./routes.js")(app, db, passport);

var port = 8080;
app.listen(port, function () { console.log("Listening on port", port); });