const mqtt = require("mqtt");
const topics = require("./topics");

var client = mqtt.connect('mqtt://127.0.0.1:1883');

client.on("connect", function() {

    const topic = topics.validatorTopic;
    client.subscribe(topic);
    console.log("Subscribed to: " + topic);

    client.publish('TestTopic', 'Published: Hello world')
})

client.on('message', function(topic, message) {
    console.log(message.toString());
})
