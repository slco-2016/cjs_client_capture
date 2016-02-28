// private stuff
var creds = require("./creds");

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
var bcrypt = require("bcrypt-nodejs");
var passport = require("passport");
require("./passport")(passport);

app.use(session({
	secret: creds.secret,
	resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// establish database connection
var db = require("./db");

// create a super user on default
db("admins").where("email", creds.superuser.email)
.then(function (res) {
	if (res.constructor === Array && res.length == 0) {

		// hash the super user's password
		creds.superuser.pass = bcrypt.hashSync(creds.superuser.pass, bcrypt.genSaltSync(8), null);
		
		db("admins").insert(creds.superuser)
		.catch(function (err) {
			throw Error(err);
		});
	}
}).catch(function (err) {
	throw Error(err);
});

// routes
require("./routes.js")(app, db, passport);

var port = 8080;
app.listen(port, function () { console.log("Listening on port", port); });