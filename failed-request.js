var lib = require('./lib.js');

lib.verify('Request failed',
[
    ['client', 'request()'],
    ['client', 'request.socket'],
    ['client', 'request.finish'],
    ['client', 'request.drain'],
    ['client', 'request.error'],
]);

var request = lib.request({port: 12345}, function (response) {
    lib.fail('Unexpected client response');
});
request.on('error', function () {
    // supress exception
});
request.end();
