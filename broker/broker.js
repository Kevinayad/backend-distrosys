const mqtt = require("mqtt");
const topics = require("./topics");
const appointments = require("../controller/appointments");
const database = require('../Database/database');
const validatorTopic = topics.validatorTopic;
const frontendTopic = topics.frontendTopic;
const localHost = 'mqtt://127.0.0.1'; // Local host
const remoteHost = ''; // Remote host

// Change the value of host to the host in use.
const host = localHost;

const port = ':1883';

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
    hostURL: (host+port)
}

const client = mqtt.connect(options.hostURL, options);

function publish(topic, message) {
    client.publish(topic, message, { qos: 1, retain:false });
}

client.on('connect', function() {
    function subscribe(topic) {
        client.subscribe(topic);
        console.log("Subscribed to: " + topic);
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
        result = database.timeSlots();

        //Example of clinic 1's timeslot for the next work week.
        console.log('Clinic 1:');
        console.log(result[0]);
    }
})
