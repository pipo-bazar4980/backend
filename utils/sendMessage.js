const ErrorResponse = require("./errorResponse");
var http = require('follow-redirects').http;

exports.sendMessage = async (req, res, next) => {
    let {number, message}=req.body
    number = decodeURI(number)
    console.log(number, message)
    try {
        const options = {
            'method': 'POST',
            'hostname': '66.45.237.70',
            'path': `/api.php?username=01638782971&password=B4RF89T7&number=${number}&message=${message}`,
            //'path': `/api.php?username=01638782971&password=B4RF89T7&number=01521201882&message=Test`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            'maxRedirects': 20
        };

        let req = http.request(options, function (res) {
            let chunks = [];

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
    }
    catch (err) {
        return next(new ErrorResponse("Something Went wrong", err))
    }
}


exports.sendMessageAllUser = async (req, res, next) => {
    let {numbers,message}=req.body;
    for(let number of numbers){
        number = decodeURI(number)
        try {
            const options = {
                'method': 'POST',
                'hostname': '66.45.237.70',
                'path': `/api.php?username=01638782971&password=B4RF89T7&number=${number}&message=${message}`,
                //'path': `/api.php?username=01638782971&password=B4RF89T7&number=01521201882&message=Test`,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                'maxRedirects': 20
            };

            let req = http.request(options, function (res) {
                let chunks = [];

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

           req.end()


        }
        catch (err) {
            return next(new ErrorResponse("Something Went wrong", err))
        }
    }
    return res.status(200).send('successful');

}