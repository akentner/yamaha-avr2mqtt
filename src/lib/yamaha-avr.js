'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var net = require('net');

var avrConnection;
var keepAliveInterval;
var errorTimeout;
var address;

var PORT = 50000;
var KEEP_ALIVE = 5;

var YamahaAvr = assign({}, EventEmitter.prototype, {
    "connect": function (addr) {
        address = addr;
        init();
        avrConnection = avrConnection.connect(PORT, address, function () {
            //client.write('I am Chuck Norris!');
            this.emit('connect');
        }.bind(this));
    }
});

function init() {

    if (avrConnection) {
        avrConnection.removeAllListeners();
    }

    avrConnection = new net.Socket();

    avrConnection.on('data', function (data) {
        var parsed = /^@([A-Z]+):([A-Z0-9_]+)=(.+)\r\n$/.exec(data);

        if (parsed) {
            console.log('getValue', parsed[1], parsed[2], parsed[3]);

            avrConnection.emit('getValue', [parsed[1], parsed[2], parsed[3]]);
        }
    });

    avrConnection.on('connect', function () {
        avrConnection.write("@MAIN:PWR=?\r\n");
        keepAliveInterval = setInterval(function () {
            avrConnection.write("@MAIN:PWR=?\r\n");
        }, KEEP_ALIVE * 1000);
    });

    avrConnection.on('error', function (err) {

        console.log('err', err);

        if (err.code === 'EHOSTUNREACH' || err.code === 'ECONNRESET') {
            console.log('retry in 30 seconds');

            errorTimeout = setTimeout(function() {
                YamahaAvr.connect(address);
            }, 30000);
        }
    });

}

module.exports = YamahaAvr;
