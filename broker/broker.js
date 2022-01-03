const mqtt = require("mqtt");
const topics = require("./topics");
const appointments = require("../controller/appointments");
const database = require('../Database/database');
const validatorTopic = topics.validatorTopic;
const frontendTopic = topics.frontendTopic;
const backendTopic = topics.backendTopic;
const localHost = 'mqtt://127.0.0.1'; // Local host
const localPort = ':1883';

const options = {
    keepalive: 60,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 1,
        retain: false
    },
    identifier: 'Local Host',
    host: (localHost+localPort)
}

const client = mqtt.connect(options.host, options);

function publish(topic, message, targetClient) {
    targetClient.publish(topic, message, { qos: 1, retain:false });
}

function subscribe(topic, targetClient) {
    targetClient.subscribe(topic);
    var name = targetClient.options.identifier;
    console.log(name + " subscribed to: " + topic, { qos: 2 });
}

client.on('connect', function() {
    
    subscribe(validatorTopic, client);
    //To discuss: for future implementation of occupying timeslot before confirming booking request
    subscribe(frontendTopic, client);
    //publish(frontendTopic, 'User request: ...');
    //TODO: update frontend with real-time available timeslots
    //publish(validatorTopic, '1', client);
    //publish(frontendTopic, '1', client);
})

client.on('message', function(topic, message) {

    if (topic == validatorTopic){
        appointments.persistAppointment(message);
    }
    if (topic == frontendTopic) {
        database.timeSlots(backendTopic);
    }
    console.log('Local host message: ' + message);
})

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
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 1,
        retain: false
    },
    identifier: 'Remote Host',
    host: (host+remotePort)
}

const remoteClient = mqtt.connect(remoteOptions.host, remoteOptions);

remoteClient.on('connect', function() {
    subscribe(validatorTopic, remoteClient);
    subscribe(frontendTopic, remoteClient);
    subscribe(backendTopic, remoteClient);
    publish(frontendTopic, '1', remoteClient);
});

remoteClient.on('message', function(topic, message) {
    if (topic == frontendTopic) {
        database.timeSlots(backendTopic, remoteClient);
    }
    //console.log(JSON.parse(message));
})

exports.publish = publish;
