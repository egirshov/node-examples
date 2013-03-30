var lib = require('./lib.js');

lib.verify('PUT request aborted before while receiving response',
[
    ['client', 'request()'],
    ['client', 'request.write()'],
    ['client', 'request.socket'],
    ['client', 'request.finish'],
    ['client', 'request.drain'],
    ['server', 'request'],
    ['server', 'request.data'],
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
        res.write('start response body');
    });
});

var request = lib.request({method: 'PUT'}, function (response) {
});
request.once('error', function (e) {
    lib.fail('Unexpected request-error event');
});
lib.record('client', 'request.write()');
request.write('request body');
request.end();

setTimeout(function () {
    lib.record('client', 'request.abort()');
    request.abort();
}, 200);

setTimeout(function () {
    server.close();
}, 500);
