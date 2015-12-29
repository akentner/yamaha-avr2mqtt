#!/usr/bin/env bash
echo node src/app.js -m $MOSQUITTO_PORT_1883_TCP -t $MQTT_TOPIC -q $MQTT_QOS -y $YAMAHA_HOST
node -v
npm i
node src/app.js -m $MOSQUITTO_PORT_1883_TCP -t $MQTT_TOPIC -q $MQTT_QOS -y $YAMAHA_HOST
