var lib = require('./lib.js');

lib.verify('PUT Request failed',
[
    ['client', 'request()'],
    ['client', 'request.write()'],
    ['client', 'request.socket'],
    ['client', 'request.finish'],
    ['client', 'request.error'],
    ['client', 'request.close'],
]);

var request = lib.request({port: 12345}, function (response) {
    lib.fail('Unexpected client response');
});
request.on('error', function () {
    // supress exception
});
lib.record('client', 'request.write()');
request.write('request body');
request.end();
setTimeout(function () {}, 100);
