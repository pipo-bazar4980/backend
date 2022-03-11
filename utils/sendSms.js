const ErrorResponse = require("./errorResponse");
var http = require('follow-redirects').http;

module.exports.sendMessage = async (req, res, next) => {
    try {
        var options = {
            'method': 'POST',
            'hostname': '66.45.237.70',
            'path': '/api.php?username=01638782971&password=B4RF89T7&number=8801685436578&message=Test%20API',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            'maxRedirects': 20
        };

        var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });

            res.on("error", function (error) {
                console.error(error);
            });
        });

        req.end();
    } catch (err) {
        return next(new ErrorResponse("Something Went wrong", err))
    }
}