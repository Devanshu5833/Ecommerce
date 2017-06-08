var jwt = require("jsonwebtoken");
var config = require("../config.js").config;

module.exports = function (app) {

    //Exclude below API's
    var options = { "exclude": ['/signup', '/login', '/favicon.ico','/forgotpassword'] };

    //Verify that token is available or not
    app.use(function (req, res, next) {
        if (!(options.exclude.includes(req.path))) {
            var token = req.headers['authoraization'];
            console.log(typeof token);
            //Get token from header
            if (token && token != "null" && token != undefined) {
                // Verify the token
                jwt.verify(token, config.secretkey, function (err, data) {
                    if (err) {
                        console.log("validation error");
                        res.status(500).send({ "error": "Token validatoin error" });
                    } else {
                        req.authorization = data;
                        next();
                    }
                });
            } else {
                console.log("token not avilable")
                res.status(400).send({ "error": "Token Not available" });
            }
            return;
        }
        next();
    })
}
