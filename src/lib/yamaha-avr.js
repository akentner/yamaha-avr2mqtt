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

var reachableTimeout;
var lastMsgKeepALive = false;

var errorState;

var YamahaAvr = assign({}, EventEmitter.prototype, {
    "connect": function (addr) {
        address = addr;
        init();
    },
    "command": function (func, section, key, value) {
        if (func === 'set') {
            sendCommand(section, key, value);
        } else {
            sendCommand(section, key);
        }
    }
});

/**
 *
 */
function keepAlive() {
    lastMsgKeepALive = true;
    sendCommand('MAIN', 'AVAIL');
    reachableTimeout = setTimeout(function () {
        client.destroy();
        YamahaAvr.emit('disconnect');
        console.log('disconnect');
        clearInterval(keepAliveInterval);
        YamahaAvr.emit('getValue', 'MAIN', 'PWR', 'Off');
        YamahaAvr.emit('getValue', 'MAIN', 'AVAIL', 'Not Found');
    }, KEEP_ALIVE * 1000);
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
                    errorState = '{"type":"undefinedCmd", "cmd": "' + lastCmd + '"}';
                    YamahaAvr.emit('error', errorState);
                    console.warn('Invalid Command: ' + lastCmd);
                } else if (line === '@RESTRICTED') {
                    errorState = '{"type":"restrictedCmd", "cmd": "' + lastCmd + '"}';
                    YamahaAvr.emit('error', errorState);
                    console.warn('Restricted Command: ' + lastCmd);
                } else {
                    if (errorState) {
                        errorState = null;
                        YamahaAvr.emit('error', null);
                    }

                    parsed = /^@([A-Z]+):([A-Z0-9_]+)=(.+)$/.exec(line);
                    if (parsed) {
                        if (lastCmd) {
                            lastAnswer = line;
                        }
                        YamahaAvr.emit('lastUpdate');
                        if (lastMsgKeepALive) {
                            lastMsgKeepALive = false;
                            clearTimeout(reachableTimeout);
                        } else {
                            YamahaAvr.emit('statusValue', parsed[1], parsed[2], parsed[3]);
                        }
                    } else {
                        console.warn('not parsed', data.toString())
                    }
                }
                lastCmd = null;
            }
        });
    });

    client.on('connect', function () {
        //sendCommand('SYS', 'MODELNAME');
        //sendCommand('SYS', 'VERSION');
        //sendCommand('SYS', 'INPNAME');
        //sendCommand('MAIN', 'PWR');
        //sendCommand('MAIN', 'VOL');
        //sendCommand('MAIN', 'MUTE');
        //sendCommand('MAIN', 'STRAIGHT');
        //sendCommand('MAIN', 'SOUNDPRG');
        //sendCommand('MAIN', 'AVAIL');
        YamahaAvr.emit('lastUpdate');
        keepAliveInterval = setInterval(function () {
            keepAlive();
        }, KEEP_ALIVE * 1000);
    });

    client.on('error', function (err) {
        client.removeAllListeners('connect');
        client.setTimeout(5000, init);
        YamahaAvr.emit('lastUpdate', err);
    });
}

module.exports = YamahaAvr;
