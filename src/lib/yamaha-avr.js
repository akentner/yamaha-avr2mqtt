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
        });
    }
});

function init() {

    if (avrConnection) {
        avrConnection.removeAllListeners();
    }

    avrConnection = new net.Socket();

    avrConnection.on('data', function (data) {
        console.log('DATA: ' + data);

        // @todo do parse

    });

    avrConnection.on('connect', function () {
        console.log('yamaha connected');
        this.emit('connected');
        avrConnection.write("@MAIN:PWR=?\r\n");
        keepAliveInterval = setInterval(function () {
            avrConnection.write("@MAIN:PWR=?\r\n");
        }, KEEP_ALIVE * 1000);
    });

    avrConnection.on('end', function () {
        this.emit('end');
    });

    avrConnection.on('error', function (err) {
        //this.emit('error');

        console.log('err', err);

        if (err.code === 'EHOSTUNREACH') {
            console.log('retry in 30 seconds');

            errorTimeout = setTimeout(function() {
                this.connect(address);
            }, 30000);
        }
    });

}

module.exports = YamahaAvr;
