(function() {
    'use strict';

    var system = require('system');
    // Make sure we have Function.bind
    require('./libs/bind-shim');

    var Server = require('./server');
    var port = system.env.PORT || 5000;
    var server = new Server(port);

    console.log('Listening on http://localhost:' + port);

})();