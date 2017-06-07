var jwt = require("jsonwebtoken");

module.exports = function (app) {
    
    //Exclude below API's
    var options = { "exclude": ['/signup', '/login','/favicon.ico'] };
    
    //Verify that token is available or not
    app.use(function (req, res, next) {
        console.log(req.path);
        if(!(options.exclude.includes(req.path))){
            console.log("INSIDE");
        }
        console.log("next");
        next();
    })
    
}
