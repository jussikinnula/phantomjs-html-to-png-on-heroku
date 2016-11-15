(function() {
    'use strict';

    // Init variables
    var webserver = require('webserver');
    var usage = 'POST HTML page to render to PNG {"html": "<html><body><h1>Hello World!</h1></body></html>","width":640,"height":480}';
    var Renderer = require('./renderer.js');
    var Server = function(port) { this.init(port); };

    Server.prototype.init = function(port) {
        this.port = port;
        this.startServer();
    };

    Server.prototype.onRequest = function(request, response) {
        switch (request.method) {
            case 'POST':
                return this.onPostRequest(request, response);
            default:
                return this.onGetRequest(request, response);
        }
    };

    Server.prototype.onGetRequest = function(request, response) {
        response.statusCode = (request.method == 'GET') ? 200 : 400;
        response.setHeader('Content-Type',  'text/plain');
        response.setHeader('Content-Length', usage.length);
        response.write(usage);
        response.close();
    };

    Server.prototype.onPostRequest = function(request, response) {
        var data;
        try {
           data = JSON.parse(request.postRaw);
        } catch(error) {
            // In case the JSON parse fails, just pass it to onError handler
            return this.onError(response, JSON.stringify(error));
        }
        if (data && data.html) {
            var renderer = new Renderer(data);
            renderer.setResponse(response);
            renderer.setOnRenderCallback(this.onRenderComplete.bind(this));
            renderer.render();
        } else {
            this.onError(response, 'Provided JSON does not have "html" entity');
        }
    };

    Server.prototype.onError = function(response, error) {
        response.statusCode = 500;
        response.setHeader('Content-Type',  'text/plain');
        response.setHeader('Content-Length', error.length);
        response.write(error);
        response.close();
    };

    Server.prototype.onRenderComplete = function(response, image) {
        response.statusCode = 200;
        response.setEncoding('binary');
        response.setHeader('Content-Type', 'image/png');
        response.setHeader('Content-Length', image.length);
        response.write(image);
        response.close();
    };

    Server.prototype.startServer = function() {
        this.server  = webserver.create();
        this.service = this.server.listen(
            this.port,
            this.onRequest.bind(this)
        );
    };

    module.exports = Server;

})();