var mongodb = require("mongodb");
var config = require("./config").config

var MongoClient = mongodb.MongoClient;

MongoClient.connect(config.databaseurl, function (err, database) {
	global.employee = database.collection('Employee');
	global.product = database.collection('product');
	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	} else {
		console.log('Database Connection established to ' + config.databaseurl + " with database " + MongoClient.database);
	}
});