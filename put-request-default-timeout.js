var lib = require('./lib.js');

lib.verify('PUT request server timeout',
[
    ['client', 'request()'],
    ['client', 'request.socket'],
    ['client', 'request.drain'],
    ['server', 'request'],
    ['server', 'request.data'],
    ['server', 'request.aborted'],
    ['server', 'request.close'],
    ['server', 'response.close'],
    ['client', 'request.error'],
    ['client', 'request.close'],
]);

var server = lib.createServer(function (req, res) {
    req.connection.setTimeout(500); // default is 2 minutes
});

var request = lib.request({method: 'PUT'}, function (response) {
});
request.on('error', function () {});
request.write('request body');

setTimeout(function () {
    server.close();
}, 500);
