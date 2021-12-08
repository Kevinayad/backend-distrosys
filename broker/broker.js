const mqtt = require("mqtt");
const topics = require("./topics");
const appointments = require("../controller/appointments")
const validatorTopic = topics.validatorTopic;
const GUITopic = topics.frontendTopic;
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

client.on("connect", function() {   

    function subscribe(topic) {
        client.subscribe(topic);
        console.log("Subscribed to: " + topic);
    }

    var appointmentMessage = {
        "userid": 12345,
        "requestid": 13,
        "dentistid": 1,
        "issuance": 1602406766314,
        "date": "2020-12-14"
    };

    subscribe(validatorTopic);
    //To discuss: for future implementation of occupying timeslot before confirming booking request
    subscribe(GUITopic);

    publish(GUITopic, 'User request: ...');
    //TODO: update frontend with real-time available timeslots

    publish(validatorTopic, JSON.stringify(appointmentMessage));
})

client.on('message', function(topic, message) {
    
    if (topic == validatorTopic){
        appointments.persistAppointment(message);
    }
    console.log(message.toString());
})
