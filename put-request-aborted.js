var lib = require('./lib.js');

lib.verify('PUT request aborted while sending request data', [
    ['client', 'request()'],
    ['client', 'request.write()'],
    ['client', 'request.socket'],
    ['client', 'request.drain'],
    ['server', 'request'],
    ['server', 'request.data'],
    ['client', 'request.abort()'],
    ['client', 'request.close'],
    ['client', 'requ.esterror'],
    ['server', 'request.aborted'],
    ['server', 'request.close'],
    ['server', 'responseclose']
]);

var server = lib.createServer(function (req, res) {
    req.on('end', function () {
        lib.fail('Unexpected server request `end` event');
    });
});

var request = lib.request({method: 'PUT'}, function (response) {
    lib.fail('Unexpected response event');
});
request.once('error', function (e) {
    // empty handle to supress exception
});
lib.record('client', 'request.write()');
request.write('request body');

setTimeout(function () {
    lib.record('client', 'request.abort()');
    request.abort();
}, 300);

setTimeout(function () {
    server.close();
}, 500);
