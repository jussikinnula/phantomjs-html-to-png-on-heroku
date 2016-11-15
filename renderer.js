(function() {
    'use strict';

    var webpage  = require('webpage');
    var base64   = require('./libs/base64.js');
    var Renderer = function(data) { this.init(data); };

    Renderer.prototype.init = function(data) {
        this.html = data.html;

        if (data.width && data.height) {
            this.width = parseInt(data.width, 10);
            this.height = parseInt(data.height, 10);
        }

        if (data.format && data.format === 'gif' || data.format === 'jpg') {
            this.format = data.format;
        } else {
            this.format = 'png';
        }

        this.pageTimeout = data.timeout ? parseInt(data.timeout) : 100;
        if (this.timeout > 1000) { this.timeout = 1000; }

        this.pageOnLoad = data.onload ? true : false;

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
            this.page.clipRect = { top: 0, left: 0, width: this.width, height: this.height };
        }
        this.page.open('about:blank', this.onPageReady.bind(this));
    };

    Renderer.prototype.setOnRenderCallback = function(callback) {
        this.onRenderCompleteCallback = callback;
    };

    Renderer.prototype.onPhantomCallback = function(message) {
        var data = base64.decode(this.page.renderBase64(this.format.toUpperCase()));
        var decoded = '';

        for (var i = 0; i < data.length; i++) {
            decoded = decoded + String.fromCharCode(data[i]);
        }

        this.onRenderCompleteCallback(this.response, this.format, decoded);

        this.page.close();
    };

    Renderer.prototype.onPageReady = function() {
        this.page.content = this.html;

        if (this.pageOnLoad) {
            var pageOnLoad = function() {
                window.onload = function() {
                    window.callPhantom('OK');
                };
            };
            this.page.evaluate(pageOnLoad);
        }

        if (this.pageTimeout > 0) {
            var pageTimeout = function() {
                setTimeout(function() {
                    window.callPhantom('OK');
                }, this.pageTimeout);
            };
            this.page.evaluate(pageTimeout);
        }
    };

    Renderer.prototype.render = function() {
        this.loadPage();
    };

    module.exports = Renderer;

})();