var lib = require('./lib.js');

lib.verify('PUT request',
[
    ['client', 'request()'],
    ['client', 'request.socket'],
    ['client', 'request.finish'],
    ['client', 'request.drain'],
    ['server', 'request'],
    ['server', 'request.data'],
    ['server', 'request.end'],
    ['server', 'response.finish'],
    ['client', 'request.response'],
    ['client', 'response.data'],
    ['client', 'response.end'],
]);

var server = lib.createServer(function (req, res) {
    req.on('end', function () {
        res.writeHead(200);
        res.end('somedata');
    });
    req.on('close', function () {
        lib.fail('Unexpected close event in the server');
    });
});

var request = lib.request({method: 'PUT'}, function (response) {
    response.on('close', function () {
        lib.fail('Unexpected close event in the client');
    });
});
request.once('error', function (e) {
    lib.fail('Unexpected error event in the client');
});
setTimeout(function () {
    request.write('request body');
    request.end();
}, 200);

setTimeout(function () {
    server.close();
}, 500);
