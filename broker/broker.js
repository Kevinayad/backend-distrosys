const mqtt = require("mqtt");
const topics = require("./topics");

const localHost = 'mqtt://127.0.0.1'; // Local host
const remoteHost = ''; // Remote host

// Change the value of host to the host in use.
const host = localHost;

const port = ':1883';

var client = mqtt.connect(host+port);

client.on("connect", function() {

    const valTopic = topics.validatorTopic;
    const handlerTopic = topics.bookingHandlerTopic;
    const GUITopic = topics.frontendTopic;

    function subscribe(topic) {
        client.subscribe(topic);
        console.log("Subscribed to: " + topic);
    }

    function publish(topic, message) {
        client.publish(topic, message);
    }

    subscribe(valTopic);
    subscribe(handlerTopic);
    subscribe(GUITopic);

    publish(valTopic, 'Validate this: ...');
    publish(handlerTopic, 'Handle this: ...');
    publish(GUITopic, 'User request: ...');
})

client.on('message', function(topic, message) {
    console.log(message.toString());
})
