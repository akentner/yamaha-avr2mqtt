#!/usr/bin/env bash
echo node src/app.js -m $MQTT_HOST -t $MQTT_TOPIC -q $MQTT_QOS -y $YAMAHA_HOST
node -v
npm i
node src/app.js -m $MQTT_HOST -t $MQTT_TOPIC -q $MQTT_QOS -y $YAMAHA_HOST
