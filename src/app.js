var mqtt   = require('mqtt');

var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .options({
        'm': {
            alias: 'mqtt',
            demand: true,
            default: 'tcp://localhost:1883',
            describe: 'MQTT address',
            type: 'string'
        },
        't': {
            alias: 'topicPrefix',
            demand: false,
            default: 'yamaha-avr',
            describe: 'MQTT topic prefix',
            type: 'string'
        },
        'q': {
            alias: 'qos',
            demand: false,
            default: '0',
            describe: 'MQTT QoS',
            type: 'string'
        },
        'y': {
            alias: 'yamaha',
            demand: true,
            describe: 'Yamaha AVR address',
            type: 'string'
        }
    })
    .help('h').alias('h', 'help')
    .argv;

var retain = true;
var topicPrefix = argv.t;
var qos = parseInt(argv.q);

var YamahaAvr = require('./lib/yamaha-avr');

var mqttConnection = mqtt.connect(argv.m, {
    //protocolId: 'MQIsdp',
    //protocolVersion: 3,
    will: {topic: "/" + topicPrefix + "/connect", payload: null, qos: qos, retain: retain}
});

mqttConnection.on('connect', function () {
    console.log('MQTT connect');

    YamahaAvr.on('connect', function() {
        console.log('Yamaha AVR connected');
        mqttConnection.publish('/' + topicPrefix + '/connect', Math.floor(Date.now() / 1000).toString(), {retain: retain, qos: qos});
        mqttConnection.subscribe('/' + topicPrefix + '/set/+/+', {qos: qos});
    });

    YamahaAvr.on('getValue', function(section, key, value) {
        mqttConnection.publish('/' + topicPrefix + '/get/' + section + '/' + key, value, {retain: retain, qos: qos});
    });

    YamahaAvr.connect(argv.y);
});

mqttConnection.on('message', function (topic, message) {
    var regEx = new RegExp('^\/' + topicPrefix + '\/set\/([A-Z]+)\/([A-Z0-9_]+)$');
    var parsed = regEx.exec(topic);
    if (parsed) {
        YamahaAvr.command(parsed[1], parsed[2], message.toString());
    }
});