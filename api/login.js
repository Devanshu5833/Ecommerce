var jwt = require("jsonwebtoken");
var config = require("../config.js").config;
var helper = require('sendgrid').mail;

module.exports = function (app) {

    //New Registration of user 
    app.post('/signup', function (req, res) {
        finduser(req.body.email, function (err, result) {
            if (result.length != 0) {
                res.status(400).send({ "error": "User with " + result[0].email + " email Id allready exist" });
                return;
            }
            employee.insert([req.body], function (err, result) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(201).send({ "success": "Inserted Successfully With Email Id " + req.body.email });
                }
            });
        });
    });

    //Chek the authantication of logged user
    app.post('/login', function (req, res) {
        finduser(req.body.email, function (err, result) {
            if (result.length == 1) {
                if (result[0].email == req.body.email && result[0].password == req.body.password) {
                    var userData = { id: result[0]._id, email: result[0].email, fname: result[0].fname, type: result[0].type };
                    var result1 = jwt.sign(userData, config.secretkey, { expiresIn: 50000 });
                    var responsejson = { AuthToken: result1, Role: result[0].type, uname: result[0].fname };
                    res.status(200).send(responsejson);
                }
                else {
                    res.status(400).send({ "error": "login Failed" });
                }
            }
            else {
                console.log("log")
                res.status(400).send({ "error": "Sorry This Type of email Id is Not available" });
            }
        });
    });

    //send mail to forgot password user
    app.post('/forgotpassword', function (req, res) {
        finduser(req.body.email, function (err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            if (result.length == 1) {
                var fromEmail = new helper.Email('devanshu.ecommerce@gmail.com');
                var toEmail = new helper.Email(result[0].email);
                var subject = 'Password Reset';
                var data = "Hello " + result[0].fname + "\n Your password is : " + result[0].password; 
                var content = new helper.Content('text/plain', data);
                var mail = new helper.Mail(fromEmail, subject, toEmail, content);

                var sg = require('sendgrid')('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');
                var request = sg.emptyRequest({
                    method: 'POST',
                    path: '/v3/mail/send',
                    body: mail.toJSON()
                });

                sg.API(request, function (error, response) {
                    if (error) {
                        res.status(400).send({ "error": "Mail sent fail" });
                        return;
                    }
                    res.status(200).send({ "Success": result[0].email })
                });
            }
            else {
                res.status(400).send({ "error": "Sorry This Type of email Id is Not available" });
            }
        });
    });

    //find user from database
    function finduser(emaild, callback) {
        employee.find({ email: '' + emaild + '' }).toArray(function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result);
        })
    }
}