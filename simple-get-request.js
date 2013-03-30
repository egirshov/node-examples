var lib = require('./lib.js');

lib.verify('GET request',
[
    ['client', 'request()'],
    ['client', 'request.socket'],
    ['client', 'request.finish'],
    ['client', 'request.drain'],
    ['server', 'request'],
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

var request = lib.request(null, function (response) {
    response.on('close', function () {
        lib.fail('Unexpected close event in the client');
    });
});
request.once('error', function (e) {
    lib.fail('Unexpected error event in the client');
});
request.end();

setTimeout(function () {
    server.close();
}, 500);
