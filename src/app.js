var mqtt   = require('mqtt');
var moment = require('moment-timezone');

var YamahaAvr = require('./lib/yamaha-avr');


var timeout;

var mqttConnection = mqtt.connect('tcp://localhost:1883', {
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    will: {topic: "yamaha-avr/connect", payload: null, qos: 1, retain: true}
});


function connectAvr() {
    console.log('connect AVR');
}

mqttConnection.on('connect', function (data) {
    console.log('MQTT connect');

    YamahaAvr.on('connect', function() {
        console.log('Yamaha AVR connected');
    });

    YamahaAvr.connect('192.168.178.12');

});

mqttConnection.on('reconnect', function () {
    console.log('mqtt reconnect');
});

mqttConnection.on('close', function () {
    console.log('mqtt close');
});

mqttConnection.on('error', function (error) {
    console.log('mqtt error: ', error);
});

mqttConnection.on('message', function (topic, message) {
    console.log('mqtt message:', topic, message.toString());
});




