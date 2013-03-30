var lib = require('./lib.js');

lib.verify('GET request aborted while receiving response body',
[
    ['client', 'request()'],
    ['client', 'request.socket'],
    ['client', 'request.finish'],
    ['client', 'request.drain'],

    ['server', 'request'],
    ['server', 'request.end'],
    ['server', 'response.drain'],

    ['client', 'request.response'],
    ['client', 'response.data'],
    ['client', 'request.abort()'],
    ['client', 'request.close'],
    ['client', 'response.aborted'],
    ['client', 'response.end'],
    ['client', 'response.close'],

    ['server', 'request.aborted'],
    ['server', 'request.close'],
    ['server', 'response.close'],
]);

var server = lib.createServer(function (req, res) {
    req.on('end', function () {
        res.writeHead(200);
        res.write('somedata');
    });
});

var request = lib.request(null, function (response) {
    setTimeout(function () {
        lib.record('client', 'request.abort()');
        request.abort();
    }, 200);
});
request.once('error', function (e) {
    lib.fail('Unexpected error event in the client');
});
request.end();

setTimeout(function () {
    server.close();
}, 500);
