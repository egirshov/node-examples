var lib = require('./lib.js');

lib.verify('GET request aborted while waiting for a response',
[
    ['client', 'request()'],
    ['client', 'request.socket'],
    ['client', 'request.finish'],
    ['client', 'request.drain'],
    ['server', 'request'],
    ['server', 'request.end'],
    ['client', 'request.abort()'],
    ['client', 'request.close'],
    ['client', 'request.error'],
    ['server', 'request.aborted'],
    ['server', 'request.close'],
    ['server', 'response.close'],
]);

var server = lib.createServer(function (req, res) {
});

var request = lib.request(null, function (response) {
    lib.fail('Unexpected response event');
});
request.on('error', function () {
    // dummy handler to supress exception
});
request.end();

setTimeout(function () {
    lib.record('client', 'request.abort()');
    request.abort();
}, 500);

setTimeout(function () {
    server.close();
}, 1000);
