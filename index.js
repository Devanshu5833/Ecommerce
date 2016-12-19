/*
File_Name : index.js
Use : Create API's to perform database operations
Author : Devanshu Oza
Date : 09/12/16
*/


//Import all the dependencies and store them on one object for access them
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var debug = require('debug')('test:server');
var mongodb = require("mongodb");
var jwt = require("jsonwebtoken");

var app = express();

//define statickey for jwt purpouse
app.set('key','ecommerce');

//Define variables for database which stores database objects
var db,employee,product;
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://devanshu:dev5833@ds133378.mlab.com:33378/ecommerce_site';

//
MongoClient.connect(url, function (err, database) {
	db = database;
	employee = database.collection('Employee');
	product = database.collection('product');
	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	} else {
		console.log('Database Connection established to '+ url + " with database " + MongoClient.database);
	}
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
        	res.sendfile('views/index.html'); 
    	});


//New Registration of user 
function signup(req,res)
{
	var equery = req.body.email;
	console.log(equery);
	employee.find({email:''+ equery + ''}).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } 
	  else(result.length) 
	  {
		  if(result.length == 0)
		  {
			  console.log(result.length);
			  var q =req.body;
			  console.log(q);
						employee.insert([q],function (err, result) {
						if (err) {
						  console.log(err);
						} else {
							res.send('Insertd Successfully Wth Email Id  '+ req.body.email);
						}
					});
		  }
		  else
		  {
		  	res.send("User with '" + equery + "' email Id allready exist");
		  }
      } 
 	});
	
}

//Chek the authantication of logged user
function login(req,res)
{
	var email = req.body.email;
	var pwd = req.body.password;
	console.log(email+ ' ' +pwd);
	employee.find({email:''+ email + ''}).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } 
	  else(result.length) 
	  {
		  if(result.length == 1)
		  {
			  if(result[0].email == email && result[0].password == pwd)
			  {
				var userData = {id: result[0]._id,email:result[0].email,fname:result[0].fname,type:result[0].type};
				  var result1 = jwt.sign(userData,app.get('key'),{expiresIn:50000});
				var responsejson = {Status:"1",AuthToken:result1,Role:result[0].type,uname:result[0].fname};
				console.log(responsejson);
			  	res.send(responsejson);
			  }
			  else
			  {
			  	res.send("login Failed");
			  }
		  }
		  else
		  {
		  	res.send("Sorry This Type of email Id is Not available");
		  }
      } 
 	});
	
}

//Manage profile of the currently logged in user
function displayuser(req,res)
{
	var token =  req.headers['authoraization'];
	if(token)
	{
		jwt.verify(token,app.get('key'),function(err,data){
			if(err){
					var error = {status:0};
					res.send(error);
			}else{
				var id = data.id;
				console.log(id);
				employee.findOne({_id: new mongodb.ObjectId(id)}, function(err, docs){
					console.log(docs);
					res.send(docs);
				});
				}
		});
	
	}
}

//Display product to the seller accordintg to their login
function displaysellerproduct(req,res)
{
	var token =  req.headers['authoraization'];
	if(token)
	{
		jwt.verify(token,app.get('key'),function(err,data){
			if(err){
					var error = {status:0};
					res.send(error);
			}else{
				var id = data.id;
				console.log(id);
				product.find({uid:id}).toArray(function (err, result) {
						  if (err) {
							console.log(err);
						  } else if (result.length) {
							res.send(result);
						  } else {
							console.log('No document(s) found with defined "find" criteria!');
						  }
					 });
				}
		});
		
	}
	
	
}
//Display All products for customer
function allproduct(req,res)
{
	var token =  req.headers['authoraization'];
	if(token)
	{
		jwt.verify(token,app.get('key'),function(err,data){
			if(err){
					var error = {status:0};
					res.send(error);
			}else{
				var id = data.id;
				//console.log(id);
				product.find({}).toArray(function (err, result) {
						  if (err) {
							console.log(err);
						  } else if (result.length) {
							res.send(result);
						  } else {
							console.log('No document(s) found with defined "find" criteria!');
						  }
					 });
				}
		});
		
	}
	
	
}

//Add a new product By the Seller
function addproduct(req,res)
{
	var token = req.headers['authoraization'];
	if(token)
	{
		jwt.verify(token,app.get('key'),function(err,data){
			if(err){
					res.send(err);
			}else{
				var id = data.id;
				var date = new Date();
				console.log(id);
				console.log(date);
				var query = {"title":req.body.title,"code":req.body.code,"keyword":req.body.keyword,"qty":req.body.qty,"price":req.body.price,"filedata":req.body.filedata,
							 "description":req.body.description,"uid":id,"createddate":date,"modifieddate":date}
				console.log(query);
				product.insert([query],function (err, result) {
				if (err) {
					console.log(err);
				} else {
						product.find({uid:id}).toArray(function (err, result) {
						  if (err) {
							console.log(err);
						  } else if (result.length) {
							res.send(result);
						  } else {
							console.log('No document(s) found with defined "find" criteria!');
						  }
					 });		
				}
			});
			}
		});
		
	}	  
}

//logged user update their profile
function updateuser(req,res)
{
	var token = req.headers['authoraization'];
	if(token)
	{
		jwt.verify(token,app.get('key'),function(err,data){
			if(err){
					res.send(err);
			}else{
				var id = data.id;
				var date = new Date();
				var query = {"fname":req.body.fname,"lname":req.body.lname,"email":req.body.email,"address":req.body.address};
				console.log(query);
				employee.update({_id: new mongodb.ObjectId(id)},{$set:query},function (err, result) {
				if (err) {
					console.log(err);
				} else {
					employee.findOne({_id: new mongodb.ObjectId(id)}, function(err, docs){
					//console.log(docs);
					res.send(docs);
				});
				}
			});
			}
		});
		
	}	  
}
//DELETE PRODUCT
function deleteproduct(req,res)
{
				var token = req.headers['authoraization'];
	if(token)
	{
		jwt.verify(token,app.get('key'),function(err,data){
			if(err){
					res.send(err);
			}else{
				var id = data.id;
				var date = new Date();
				product.remove({code:req.param("name")},function (err, result) {
				if (err) {
					console.log(err);
				} else {
						product.find({uid:id}).toArray(function (err, result) {
						  if (err) {
							console.log(err);
						  } else  {
							res.send(result);
						  } 
					 });		
				}
			});
			}
		});
		
	}   
}
//update Product
function updateproduct(req,res)
{
	var token = req.headers['authoraization'];
	if(token)
	{
		jwt.verify(token,app.get('key'),function(err,data){
			if(err){
					res.send(err);
			}else{
				var id = data.id;
				var date = new Date();
				console.log(req.param("name"))
				var query = {"title":req.body.title,"code":req.body.code,"keyword":req.body.keyword,"qty":req.body.qty,"price":req.body.price,
							 "description":req.body.description,"uid":id,"modifieddate":date};
				console.log(query);
				product.update({code:req.param("name")},{$set:query},function (err, result) {
				if (err) {
					console.log(err);
				} else {
						product.find({uid:id}).toArray(function (err, result) {
						  if (err) {
							console.log(err);
						  } else  {
							res.send(result);
						  } 
					 });		
				}
			});
			}
		});
		
	}   
}
//Find only one product
function oneproduct(req,res)
{
	var token = req.headers['authoraization'];
	if(token)
	{
		jwt.verify(token,app.get('key'),function(err,data){
			if(err){
					res.send(err);
			}else{
				var id = data.id;
				var date = new Date();
				product.findOne({code:req.param("name")},function (err, result) {
				if (err) {
					console.log(err);
				} else {
						res.send(result);		
				}
			});
			}
		});
		
	}   
}


app.post('/signup',signup);
app.post('/login',login);
app.post('/addproduct',addproduct);
app.get('/displayuser',displayuser);
app.get('/displaysellerproduct',displaysellerproduct);
app.put('/updateuser',updateuser);
app.get('/allproduct',allproduct);
app.delete('/deleteproduct/:name',deleteproduct);
app.put('/updateproduct/:name',updateproduct);
app.get ('/oneproduct/:name',oneproduct);


app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'),function(){
	console.log("server is running successfully on " + app.get('port'));
});