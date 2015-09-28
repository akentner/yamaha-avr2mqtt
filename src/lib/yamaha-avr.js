'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var avrConnection;
var keepAliveInterval;
var errorTimeout;
var address;

const PORT = 50000;
const KEEP_ALIVE = 30;


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
        this.emit('connected');
        keepAliveInterval = setInterval(function () {
            avrConnection.write("@MAIN:PWR=?\r\n");
        }, KEEP_ALIVE);
    });

    avrConnection.on('end', function () {
        this.emit('end');
    });

    avrConnection.on('error', function (err) {
        this.emit('error');

        if (err.code === 'EHOSTUNREACH') {
            console.log('retry in 30 seconds');

            errorTimeout = setTimeout(function() {
                this.connect(address);
            }, 30);
        }
    });

}

module.exports = YamahaAvr;
