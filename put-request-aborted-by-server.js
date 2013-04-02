var lib = require('./lib.js');


lib.verify('PUT request aborted by server', [
    ['client', 'request()'],
    ['client', 'request.socket'],
    ['client', 'request.drain'],
    ['server', 'request'],
    ['server', 'request.data'],
    ['server', 'request.destroy()'],
    ['client', 'request.close'],
    ['client', 'request.error'],
    ['server', 'request.aborted'],
    ['server', 'request.close'],
    ['server', 'response.close']
]);

var server = lib.createServer(function (req, res) {
    setTimeout(function () {
        lib.record('server', 'request.destroy()');
        request.destroy();
    }, 100);
});

var request = lib.request({method: 'PUT'}, function (response) {
    lib.fail('Unexpected response event');
});
request.once('error', function (e) {
});
request.write('part of request body');


setTimeout(function () {
    server.close();
}, 500);
