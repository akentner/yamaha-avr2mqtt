#!/usr/bin/env bash
echo node src/app.js -m $MQTT_PORT_1883_TCP -t $MQTT_TOPIC -q $MQTT_QOS -y $YAMAHA_HOST
node -v
node src/app.js -m $MQTT_PORT_1883_TCP -t $MQTT_TOPIC -q $MQTT_QOS -y $YAMAHA_HOST
