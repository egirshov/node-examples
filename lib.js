'use strict';

var assert = require('assert');
var http = require('http');

var CLIENT = 'client';
var SERVER = 'server';
var TEST_PORT = 9000;

var sequence = [];
var ignored_events = ['newListener'];

function assert (entry, origin, message) {
    assert(entry[0] === origin,
            'Expect message from ' + origin + ', got from ' + entry[0]);
    assert(entry[1] === message,
            'Expect message ' + message + ', got ' + entry[1]);
}

function fail(message) {
    throw Error(message);
}

function hijack(emitter, where, what) {
    var original_emit = emitter.emit;
    emitter.emit = function (/*...*/) {
        if (ignored_events.indexOf(arguments[0]) === -1) {
            record(where, what + '.' + arguments[0]);
        }
        original_emit.apply(emitter, [].slice.call(arguments, 0));
    };
    return emitter;
}

function record(where, what) {
    console.log('Record:', where, what);
    sequence.push([where, what]);
}

function verify(description, expect) {
    process.on('exit', function () {
        console.log('\n\n', description, '\n');
        console.log(JSON.stringify(sequence));

        assert(sequence.length === expect.length,
            'Expect ' + expect.length + ' events, got ' + sequence.length);
        for (var i = 0; i < sequence.length; i += 1) {
            assert(sequence[i], expect[i][0], expect[i][1]);
        }
    });
}

function createServer(handler) {
    var server = http.createServer(function (req, res) {
        record(SERVER, 'request');
        hijack(req, 'server', 'request');
        hijack(res, 'server', 'response');
        return handler(req, res);
    });
    server.listen(TEST_PORT);
    return server;
}

function request(options, callback) {
    record(CLIENT, 'request()');
    options = options || {};
    options.host = '127.0.0.1';
    options.port = options.port || TEST_PORT;
    var req = http.request(options, function (response) {
        callback(hijack(response, 'client', 'response'));
    });
    return hijack(req, 'client', 'request');
}

module.exports = {
    assert: assert,
    createServer: createServer,
    fail: fail,
    hijack: hijack,
    record: record,
    request: request,
    verify: verify,
};
