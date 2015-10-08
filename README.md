# yamaha-avr2mqtt

A simple adapter for connection Yamaha AVR to MQTT.


## Usage

    node src/app.js -y <yamaha ip> -m <mqtt url>

The adapter publishes incoming status values from Yamaha on MQTT at ```/<topic>/get/#``` and receives values for
Yamaha at ```/<topic>/set/#```.

Currently tested with RX-V473

### Options
    -m, --mqtt         MQTT address        (optional, default: "tcp://localhost:1883")
    -t, --topicPrefix  MQTT topic prefix   (optional, default: "yamaha-avr")
    -q, --qos          MQTT QoS            (optional, default: 0)
    -y, --yamaha       Yamaha AVR address  (mandantory)

### Example messages from Yamaha

    /yamaha-avr/get/MAIN/PWR On
    /yamaha-avr/get/MAIN/VOL -50.5
    /yamaha-avr/get/MAIN/STRAIGHT Off
    /yamaha-avr/get/MAIN/SOUNDPRG 5ch Stereo
    /yamaha-avr/get/MAIN/MUTE Off
    /yamaha-avr/get/MAIN/INP AV1
    /yamaha-avr/get/MAIN/ENHANCER Off
    /yamaha-avr/get/MAIN/AVAIL Ready
    /yamaha-avr/get/MAIN/DIRMODE Off
    /yamaha-avr/get/SYS/MODELNAME RX-V473
    /yamaha-avr/get/SYS/VERSION 1.14/1.04
    /yamaha-avr/get/SYS/INPNAMEHDMI1    PS3
    /yamaha-avr/get/SYS/INPNAMEHDMI2    TV
    /yamaha-avr/get/SYS/INPNAMEHDMI3  AppleTV
    /yamaha-avr/get/SYS/INPNAMEHDMI4 Satellite
    /yamaha-avr/get/SYS/INPNAMEAV1    AV1
    /yamaha-avr/get/SYS/INPNAMEAV2    AV2
    /yamaha-avr/get/SYS/INPNAMEAV3    AV3
    /yamaha-avr/get/SYS/INPNAMEAV4    AV4
    /yamaha-avr/get/SYS/INPNAMEAV5    AV5
    /yamaha-avr/get/SYS/INPNAMEAV6    AV6
    /yamaha-avr/get/SYS/INPNAMEVAUX   V-AUX
    /yamaha-avr/get/SYS/INPNAMEUSB    USB
    /yamaha-avr/get/SYS/DMCCONTROL Enable
    /yamaha-avr/connect 1444332783


### Example commands for Yamaha

    /yamaha-avr/set/MAIN/VOL -50.5
    /yamaha-avr/set/MAIN/STRAIGHT On
    /yamaha-avr/set/MAIN/SOUNDPRG 5ch Stereo

