const mqtt = require("mqtt");
const topics = require("./topics");
const appointments = require("../controller/appointments");
const database = require('../Database/database');
const validatorTopic = topics.validatorTopic;
const frontendTopic = topics.frontendTopic;
const backendTopic = topics.backendTopic;


function publish(topic, message) {
    remoteClient.publish(topic, message, { qos: 1, retain:false });
}

function subscribe(topic) {
    remoteClient.subscribe(topic);
    console.log("Subscribed to: " + topic, { qos: 2 });
}

const host = "ws://broker.emqx.io"
const remotePort = ':8083/mqtt';

var clientId ="mqttjs_" + Math.random().toString(16).substr(3, 8);

const remoteOptions = {
    keepalive: 60,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clientId: clientId,
    username: 'test',
    password: '12',
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
        topic: 'WillMsg12',
        payload: 'backend failure',
        qos: 1,
        retain: false
    },
    identifier: 'Remote Host',
    host: (host+remotePort)
}

const remoteClient = mqtt.connect(remoteOptions.host, remoteOptions);

remoteClient.on('connect', function() {
    subscribe(validatorTopic);
    subscribe(frontendTopic);
    //publish(backendTopic, 'Success');
    //publish(validatorTopic,dum);      publishing the appointment, it is tested with dummy data for now
});

remoteClient.on('message', function(topic, message) {

    if (topic == frontendTopic) {
        database.timeSlots(backendTopic);
    }
    if (topic == validatorTopic){
        if(message=="false"){
            publish(backendTopic,"bookFail");
        }else{
            appointments.persistAppointment(message);
        }
        
    }
})

exports.publish = publish;
exports.backendTopic = backendTopic;