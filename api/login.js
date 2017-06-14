/*
File        : login.js
Description : Login & SignUp related endpoints
Author      : Devanshu Oza
*/

//Core Modules
var path = require('path');
//npm Modules
var jwt = require("jsonwebtoken");
var helper = require('sendgrid').mail;
var mongodb = require("mongodb");
//Other Modules
var config = require("../config.js").config;

module.exports = function (app) {
    /* ----------- API --------*/
    //New Registration of user 
    app.post('/signup', function (req, res) {
        //Check that user allready exist or not
        finduser(req.body.email, function (err, result) {
            if (result.length != 0) {
                //response : error
                return res.status(400).send({ "error": "User with " + result[0].email + " email Id allready exist" });
            }
            //Insert new user into datbase
            employee.insert([req.body], function (err, result) {
                if (err) {
                    //response : error
                    res.status(500).send({ "error": err });
                } else {
                    //response : New user created Successfully
                    res.status(201).send({ "success": "Inserted Successfully With Email Id " + req.body.email });
                }
            });
        });
    });

    //Chek the authantication of logged user
    app.post('/login', function (req, res) {
        //Check that user exist or not
        finduser(req.body.email, function (err, result) {
            if (result.length == 1) {
                //Match emailid or password
                if (result[0].email == req.body.email && result[0].password == req.body.password) {
                    //bind data into token 
                    var userData = { id: result[0]._id, email: result[0].email, fname: result[0].fname, type: result[0].type };
                    //token creation
                    var result1 = jwt.sign(userData, config.secretkey, { expiresIn: 50000 });
                    var responsejson = { AuthToken: result1, Role: result[0].type, uname: result[0].fname };
                    //response : Authorization token
                    res.status(200).send(responsejson);
                }
                else {
                    //response : error
                    res.status(400).send({ "error": "login Failed" });
                }
            }
            else {
                //response : Emailid not available
                res.status(400).send({ "error": "Sorry This Type of email Id is Not available" });
            }
        });
    });

    //send mail to forgot password user
    app.post('/forgotpassword', function (req, res) {
        //Check that user allready exist or not
        finduser(req.body.email, function (err, result) {
            if (err) {
                //response : error
                return res.status(500).send({ "error": err });
            }
            if (result.length == 1) {
                //token generation
                var userdata = { email: result[0].email, id: result[0]._id }
                var token = jwt.sign(userdata, config.pswd_reset_key, { expiresIn: 10000 })
                //Mail creation
                var fromEmail = new helper.Email(config.frommail);
                var toEmail = new helper.Email(result[0].email);
                var subject = 'Password Reset';
                var data = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/#/passwordreset?token=' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                var content = new helper.Content('text/plain', data);
                var mail = new helper.Mail(fromEmail, subject, toEmail, content);
                //Mail configuration
                var sg = require('sendgrid')(config.sendgrid_API_key);
                var request = sg.emptyRequest({
                    method: 'POST',
                    path: '/v3/mail/send',
                    body: mail.toJSON()
                });
                //send mail
                sg.API(request, function (error, response) {
                    if (error) {
                        //response : error
                        return res.status(400).send({ "error": "Mail sent fail" });
                    }
                    //response : mail send Successfully
                    res.status(200).send({ "Success": result[0].email })
                });
            }
            else {
                //response : Emailid not available
                res.status(400).send({ "error": "Sorry This Type of email Id is Not available" });
            }
        });
    });

    //Password Reset API
    app.put('/reset/:token', function (req, res) {
        var token = req.params.token;
        var pwd = req.body.password;
        //check token is available or not
        if (token && token != "null" && token != undefined) {
            // Verify the token
            jwt.verify(token, config.pswd_reset_key, function (err, data) {
                if (err) {
                    //check token is expire or not
                    if (err.name && err.name == 'TokenExpiredError') {
                        return res.status(400).send({ "error": "Link de-activate, Try again" });
                    }
                    //define link in mail is valid or not
                    res.status(500).send({ "error": "Invalid Link , Try again" });
                } else {
                    //Check use exist or not
                    finduser(data.email, function (err, result) {
                        if (err) {
                            //response : error
                            res.status(500).send({ "error": err });
                            return;
                        }
                        //update password
                        var query = { "password": pwd };
                        employee.update({ _id: new mongodb.ObjectId(data.id) }, { $set: query }, function (err, result) {
                            if (err) {
                                //response : error
                                res.status(500).send({ "error": err });
                            } else {
                                //response : password updated Successfully
                                res.status(200).send({ "success": "Password updated Successfully With Email Id " + data.email });
                            }
                        });
                    });
                }
            });
        } else {
            //response : Invalid link
            res.status(400).send({ "error": "Invalid Link , Try again" });
        }
    });

    /* ----- Protected Function ------*/
    //find user from database
    function finduser(emaild, callback) {
        //find basedon emailid
        employee.find({ email: '' + emaild + '' }).toArray(function (err, result) {
            if (err) {
                //callback : error
                callback(err, null);
                return;
            }
            //callback : result
            callback(null, result);
        })
    }
}