require('phantomjs-crypto-polyfill')
var webserver = require('webserver');
var system = require('system');
var webpage = require('webpage');
var webpage = require('./libs/base64');

var server = webserver.create();
var port = system.env.PORT || 5000;
console.log('Listening on port http://localhost:' + port);
var service = server.listen(port, handleRequest);

function handleRequest(request, response) {
    switch (request.method) {
        case 'POST':
            return handlePostRequest(request, response);
        default:
            return handleGetRequest(request, response);
    }
}

function handlePostRequest(request, response) {
    var html;
    render(request.postRaw, function(error, image) {
        if (error || !image) {
            handleError(response, error);
        } else {
            response.statusCode = 200;
            response.setEncoding('binary');
            response.setHeader('Content-Type', 'image/png');
            response.setHeader('Content-Length', image.length);
            response.write(image);
            response.close();   
        }
    });
}

function handleError(response, error) {
    response.statusCode = 500;
    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Content-Length', error.length);
    response.write(error);
    response.close();
}

function handleGetRequest(request, response) {
    var usage = 'POST HTML page to render to PNG {"html": "<html><body><h1>Hello World!</h1></body></html>"}';
    response.statusCode = (request.method == 'GET') ? 200 : 400;
    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Content-Length', usage.length);
    response.write(usage);
    response.close();
}

function render(html, callback) {
    console.log("webpage.create");
    var page = webpage.create();
    console.log("page.open");
    page.open('about:black', function() {
        console.log("Page opened");
        page.onLoadFinished = function() {
            console.log("onLoadFinished");
            var data = base64.decode(page.renderBase64('png'));
            var decoded = '';
            for (var i = 0; i < data.length; i++) {
                decoded = decoded + String.fromCharCode(data[i]);
            }
            callback(null, decoded);
            page.close();
        }
        page.onError = function(error) {
            callback(error, null);
        }
        page.setContent = html;
    });
}