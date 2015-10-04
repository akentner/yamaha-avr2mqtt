'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var net = require('net');

var client;
var keepAliveInterval;
var address;

var PORT = 50000;
var KEEP_ALIVE = 5;

var YamahaAvr = assign({}, EventEmitter.prototype, {
    "connect": function (addr) {
        address = addr;
        init();
    },
    "command": function (section, key, value) {
        var cmd = '@' + section.toUpperCase() + ':' + key.toUpperCase() + '=' + value + "\r\n";
        client.write(cmd);
    }
});

function init() {

    console.log('try to connect Yamaha AVR on ' + address + ':' + PORT);
    if (client) {
        client.removeAllListeners();
    }

    client = new net.Socket();
    client.setTimeout(5000);

    client = client.connect(PORT, address, function () {
        YamahaAvr.emit('connect');
    }.bind(this));

    client.on('data', function (data) {
        var parsed;
        data.toString().split("\r\n").forEach(function(line) {
            if (line !== '' && line !== '@RESTRICTED') {
                parsed = /^@([A-Z]+):([A-Z0-9_]+)=(.+)$/.exec(line);
                if (parsed) {
                    YamahaAvr.emit('getValue', parsed[1], parsed[2], parsed[3]);
                } else {
                    console.warn('not parsed', data.toString())
                }
            }
        });
    });

    client.on('connect', function () {
        client.write("@SYS:MODELNAME=?\r\n");
        client.write("@SYS:VERSION=?\r\n");
        client.write("@SYS:INPNAME=?\r\n");
        client.write("@MAIN:PWR=?\r\n");
        client.write("@MAIN:VOL=?\r\n");
        client.write("@MAIN:MUTE=?\r\n");
        client.write("@MAIN:STRAIGHT=?\r\n");
        client.write("@MAIN:SOUNDPRG=?\r\n");
        client.write("@MAIN:INP=?\r\n");
        //client.write("@MAIN:SCENE=?\r\n");
        //client.write("@MAIN:HDMIAUDOUTAMP=?\r\n");
        keepAliveInterval = setInterval(function () {
            client.write("\r\n");
        }, KEEP_ALIVE * 1000);
    });

    client.on('error', function (err) {
        client.removeAllListeners('connect');
        client.setTimeout(5000, init);
    });
}

module.exports = YamahaAvr;
