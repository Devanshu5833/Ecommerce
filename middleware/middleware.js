var jwt = require("jsonwebtoken");
var config = require("../config.js").config;

module.exports = function (app) {

    //Exclude below API's
    var options = { "exclude": ['/signup', '/login', '/favicon.ico', '/forgotpassword', '/reset', '/updatepwd'] };

    //Verify that token is available or not
    app.use(function (req, res, next) {
        var path = "/" + req.path.split("/")[1];
        if (!(options.exclude.includes(path))) {
            var token = req.headers['authoraization'];
            //Get token from header
            if (token && token != "null" && token != undefined) {
                // Verify the token
                jwt.verify(token, config.secretkey, function (err, data) {
                    if (err) {
                        //response : token validation error
                        console.log("validation error");
                        res.status(500).send({ "error": "Token validatoin error" });
                    } else {
                        //set authorization token in header request
                        req.authorization = data;
                        next();
                    }
                });
            } else {
                //response : error
                console.log("token not avilable")
                res.status(400).send({ "error": "Token Not available" });
            }
            return;
        }
        next();
    })
}
