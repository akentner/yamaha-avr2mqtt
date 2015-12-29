FROM node:latest

ADD . /app
WORKDIR /app

RUN npm install

ENV NODE_ENV production
ENV MQTT_HOST tcp://localhost:1883
ENV MQTT_TOPIC yamaha-avr
ENV MQTT_QOS 0
ENV YAMAHA_HOST 192.168.178.12

#RUN ["sh", "-c", "echo src/app.js -m ${MQTT_HOST} -t ${MQTT_TOPIC} -q ${MQTT_QOS} -y ${YAMAHA_HOST}"]
#CMD ["sh", "-c", "node src/app.js -m ${MQTT_HOST} -t ${MQTT_TOPIC} -q ${MQTT_QOS} -y ${YAMAHA_HOST}"]
#CMD ["sh", "-c", "./run.sh"]
CMD ./run.sh