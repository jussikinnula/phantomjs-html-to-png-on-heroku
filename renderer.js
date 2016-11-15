(function() {
    'use strict';

    var webpage  = require('webpage');
    var base64   = require('./libs/base64.js');
    var Renderer = function(data) { this.init(data); };

    Renderer.prototype.init = function(data) {
        this.html = data.html;
        this.width = parseInt(data.width, 10);
        this.height = parseInt(data.height, 10);
        this.page = webpage.create();

        this.setOnRenderCallback(function() {});

        this.page.onCallback = this.onPhantomCallback.bind(this);

        this.page.onConsoleMessage = function(message, lineNum, sourceId) {
            console.log('CONSOLE: ' + (typeof message == 'string' ? message : JSON.stringify(message)));
        };
    };

    Renderer.prototype.setResponse = function(response) {
        this.response = response;
    };

    Renderer.prototype.loadPage = function() {
        if (this.width > 0 && this.height > 0) {
            this.page.viewportSize = { width: this.width, height: this.height };
        }
        this.page.open('about:blank', this.onPageReady.bind(this));
    };

    Renderer.prototype.setOnRenderCallback = function(callback) {
        this.onRenderCompleteCallback = callback;
    };

    Renderer.prototype.onPhantomCallback = function(message) {
        var data = base64.decode(this.page.renderBase64('png'));
        var decoded = '';

        for (var i = 0; i < data.length; i++) {
            decoded = decoded + String.fromCharCode(data[i]);
        }

        this.onRenderCompleteCallback(
            this.response,
            decoded
        );

        this.page.close();
    };

    Renderer.prototype.onPageReady = function() {
        this.page.content = this.html;
        var pageReady = function() {
            window.onload = function() {
                window.callPhantom('OK');
            };            
        };
        this.page.evaluate(pageReady);
    };

    Renderer.prototype.render = function() {
        this.loadPage();
    };

    module.exports = Renderer;

})();