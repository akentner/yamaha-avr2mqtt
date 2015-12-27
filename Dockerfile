FROM node:latest

ADD . /app
WORKDIR /app

RUN npm install

ENV NODE_ENV production
ENV MQTT_HOST tcp://localhost
ENV MQTT_TOPIC yamaha-avr
ENV MQTT_QOS 0
ENV YAMAHA_HOST 192.168.178.12

CMD ["node", "src/app.js", "--mqtt=$MQTT_HOST", "--topicPrefix=$MQTT_TOPIC", "--qos=$MQTT_QOS", '--yamaha=$YAMAHA_HOST"]