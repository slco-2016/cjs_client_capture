// app initialization
var express = require("express");
var app = express();

// dependencies
var bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/", function (req, res) {
	res.send("index");
});


var port = 4040;
app.listen(port, function () { console.log("Listening on port", port); });