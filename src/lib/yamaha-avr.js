'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var net = require('net');

var client;
var keepAliveInterval;
var address;

var PORT = 50000;
var KEEP_ALIVE = 5;

var lastCmd;
var lastAnswer;

var YamahaAvr = assign({}, EventEmitter.prototype, {
    "connect": function (addr) {
        address = addr;
        init();
    },
    "command": function (section, key, value) {
        sendCommand(section, key, value);
    }
});

/**
 *
 */
function keepAlive() {
    client.write("\r\n");
}

/**
 *
 * @param section
 * @param key
 * @param value
 */
function sendCommand(section, key, value) {
    if (!value) {
        value = '?';
    }

    var cmd = '@' + section.toUpperCase() + ':' + key.toUpperCase() + '=' + value;
    client.write(cmd + "\r\n");
    lastCmd = cmd;
}

/**
 *
 */
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
            if (line !== '') {
                if (line === '@UNDEFINED') {
                    console.warn('Invalid Command: ' + lastCmd);
                } else if (line === '@RESTRICTED') {
                    console.warn('Restricted Command: ' + lastCmd);
                } else {
                    parsed = /^@([A-Z]+):([A-Z0-9_]+)=(.+)$/.exec(line);
                    if (parsed) {
                        if (lastCmd) {
                            lastAnswer = line;
                        }
                        YamahaAvr.emit('getValue', parsed[1], parsed[2], parsed[3]);
                    } else {
                        console.warn('not parsed', data.toString())
                    }
                }
                lastCmd = null;
            }


        });
    });

    client.on('connect', function () {
        sendCommand('SYS', 'MODELNAME');
        sendCommand('SYS', 'VERSION');
        sendCommand('SYS', 'INPNAME');
        sendCommand('MAIN', 'PWR');
        sendCommand('MAIN', 'VOL');
        sendCommand('MAIN', 'MUTE');
        sendCommand('MAIN', 'STRAIGHT');
        sendCommand('MAIN', 'SOUNDPRG');
        sendCommand('MAIN', 'AVAIL');
        keepAliveInterval = setInterval(function () {
            keepAlive();
        }, KEEP_ALIVE * 1000);
    });

    client.on('error', function (err) {
        client.removeAllListeners('connect');
        client.setTimeout(5000, init);
    });
}

module.exports = YamahaAvr;
