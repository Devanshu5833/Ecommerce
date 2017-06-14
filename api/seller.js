/*
File        : seller.js
Description : 
Author      : Devanshu Oza
*/

//npm Modules
var base64Img = require('base64-img');
const uuidV1 = require('uuid/v1');
var mongodb = require("mongodb");

module.exports = function (app) {

    /* --------------------------- Private function --------------------------*/

    function finduser(id, callback) {
        employee.findOne({ _id: new mongodb.ObjectId(id) }, function (err, docs) {
            callback(err, docs);
        });
    }

    /* ---------------------------- API --------------------------------------*/
    //Add a new product by seller
    app.post('/addproduct', function addproduct(req, res) {
        var data = req.authorization;
        var id = data.id;
        var date = new Date();
        var uniquekey = uuidV1();
        console.log(uniquekey);
        console.log(req.body.filedata);
        var query = {
            "title": req.body.title, "code": req.body.code, "keyword": req.body.keyword, "qty": req.body.qty,
            "price": req.body.price, "filedata": req.body.filedata, "description": req.body.description,
            "uid": id, "createddate": date, "modifieddate": date
        }
        product.insert([query], function (err, result) {
            if (err) {
                res.status(500).send({ "error": err });
            } else {
                res.status(201).send({ "success": "Inserted Successfully" })
            }
        });
    });

    //Display seller Product
    app.get('/displaysellerproduct', function (req, res) {
        var data = req.authorization;
        var id = data.id;
        product.find({ uid: id }).toArray(function (err, result) {
            if (err) {
                res.status(500).send({ "error": err });
            } else if (result.length) {
                res.status(200).send({ "success": result })
            } else {
                res.status(400).send({ "error": "No document(s) found with defined find criteria!" });
            }
        });
    });

    //Display all product for customer
    app.get('/allproduct', function (req, res) {
        var data = req.authorization;
        var id = data.id;
        product.find({}).toArray(function (err, result) {
            if (err) {
                res.status(500).send({ "error": err });
            } else if (result.length) {
                res.status(200).send({ "success": result })
            } else {
                res.status(400).send({ "error": "No document(s) found with defined find criteria!" });
            }
        });
    });

    //Manage profile of the currently logged in user
    app.get('/displayuser', function (req, res) {
        var data = req.authorization;
        var id = data.id;
        finduser(id, function (err, result) {
            if (!err) {
                res.status(200).send({ "success": result });
            }
        })
    });

    //logged user update their profile
    app.put('/updateuser', function (req, res) {
        var data = req.authorization;
        var id = data.id;
        var date = new Date();
        var query = { "fname": req.body.fname, "lname": req.body.lname, "email": req.body.email, "address": req.body.address };
        employee.update({ _id: new mongodb.ObjectId(id) }, { $set: query }, function (err, result) {
            if (err) {
                res.status(500).send({ "error": err });
            } else {
                finduser(id, function (err, result) {
                    if (!err) {
                        res.status(200).send({ "success": result });
                    }
                })
            }
        });
    });

    //seller delete product
    app.delete('/deleteproduct/:name', function (req, res) {
        var data = req.authorization;
        var id = data.id;
        var date = new Date();
        product.remove({ code: req.param("name") }, function (err, result) {
            if (err) {
                res.status(500).send({ "error": err });
            } else {
                product.find({ uid: id }).toArray(function (err, result) {
                    if (err) {
                        res.status(500).send({ "error": err });
                    } else {
                        res.status(200).send({ "success": result });
                    }
                });
            }
        });
    });

    //seller update product
    app.put('/updateproduct/:name', function (req, res) {
        var data = req.authorization;
        var id = data.id;
        var date = new Date();
        var query = {
            "title": req.body.title, "code": req.body.code, "keyword": req.body.keyword, "qty": req.body.qty, "price": req.body.price,
            "description": req.body.description, "uid": id, "modifieddate": date
        };
        product.update({ code: req.param("name") }, { $set: query }, function (err, result) {
            if (err) {
                res.status(500).send({ "error": err });
            } else {
                product.find({ uid: id }).toArray(function (err, result) {
                    if (err) {
                        res.status(500).send({ "error": err });
                    } else {
                        res.status(200).send({ "success": result });
                    }
                });
            }
        });
    });

    //Find only one product (REF : update product display old information)
    app.get('/oneproduct/:name', function (req, res) {
        var data = req.authorization;
        var id = data.id;
        var date = new Date();
        product.findOne({ code: req.param("name") }, function (err, result) {
            if (err) {
                res.status(500).send({ "error": err });
            } else {
                res.status(200).send({ "success": result });
            }
        });
    });

}