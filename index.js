/*
File_Name : index.js
Use : Starting point of application
Author : Devanshu Oza
Date : 09/12/16
*/

//Import all the dependencies and store them on one object for access them
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var config = require("./config").config;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }), function (err, req, res, next) {
  if (err) {
    res.status(400).send({"error" : "JSON is not in a proper format"});
    return;
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
	res.sendFile('views/index.html');
});


app.listen((process.env.PORT || config.serverport), function (err) {
	if(!err){
		console.log("server is running successfully on " + config.serverport);
		require("./middleware/middleware.js")(app);
		require("./dbconnection.js");
		require("./api/login.js")(app);
		require("./api/seller.js")(app);
	}
});