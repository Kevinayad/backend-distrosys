const mqtt = require("mqtt");
const topics = require("./topics");
const appointments = require("../controller/appointments");
const database = require('../Database/database');
const validatorTopic = topics.validatorTopic;
const frontendTopic = topics.frontendTopic;
const backendTopic = topics.backendTopic;
const localHost = 'mqtt://127.0.0.1'; // Local host
const remoteHost = ''; // Remote host


//const port = ':8083';
var clientId =
  "mqttjs_" +
  Math.random()
    .toString(16)
    .substr(3, 8);

const options = {
    keepalive: 60,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clientId: clientId,
    username: 'group12',
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
    //hostURL: (host+port)
}

//const client = mqtt.connect(options.hostURL, options);
const client = mqtt.connect(host, options);


function publish(topic, message) {
    client.publish(topic, message, { qos: 1, retain:false });
}

client.on('connect', function() {
    function subscribe(topic) {
        client.subscribe(topic);
        console.log("Subscribed to: " + topic, { qos: 2 });

    }
    
    subscribe(validatorTopic);
    //To discuss: for future implementation of occupying timeslot before confirming booking request
    subscribe(frontendTopic);
    //publish(frontendTopic, 'User request: ...');
    //TODO: update frontend with real-time available timeslots
})

client.on('message', function(topic, message) {

    if (topic == validatorTopic){
        appointments.persistAppointment(message);
    }
    if (topic == frontendTopic) {
        database.timeSlots(backendTopic);
        
    }
})

const host = "ws://broker.emqx.io:8083/mqtt"

exports.publish = publish;
