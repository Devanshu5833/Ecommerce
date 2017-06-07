var jwt = require("jsonwebtoken");

module.exports = function (app) {

    //New Registration of user 
    app.post('/signup', function (req, res) {
        finduser(req.body.email, function (result) {
            if (result.length != 0) {
                res.status(400).send({ "error": "User with " + result[0].email + " email Id allready exist" });
                return;
            }
            employee.insert([req.body], function (err, result) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(201).send({"success" : "Inserted Successfully With Email Id " + req.body.email});
                }
            });
        });
    });

    //Chek the authantication of logged user
    app.post('/login', function (req, res) {
        finduser(req.body.email, function (result) {
            if (result.length == 1) {
                if (result[0].email == req.body.email && result[0].password == req.body.password) {
                    var userData = { id: result[0]._id, email: result[0].email, fname: result[0].fname, type: result[0].type };
                    var result1 = jwt.sign(userData, app.get('key'), { expiresIn: 50000 });
                    var responsejson = { Status: "1", AuthToken: result1, Role: result[0].type, uname: result[0].fname };
                    res.status(200).send(responsejson);
                }
                else {
                    res.status(400).send({"error" : "login Failed"});
                }
            }
            else {
                console.log("log")
                res.status(400).send({"error" : "Sorry This Type of email Id is Not available"});
            }
        });
    });

    //find user from database
    function finduser(emaild, callback) {
        employee.find({ email: '' + emaild + '' }).toArray(function (err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            callback(result);
        })
    }
}