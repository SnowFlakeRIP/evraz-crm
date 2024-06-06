
const mqttOptions = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    keepalive: 0,
};
const mqtt = require('mqtt');
const mqttClient = mqtt.connect("ws://broker.hivemq.com:8000/mqtt")
mqttClient.on('connect', function () {
    console.log('MQTT connection OK')
    console.log(`Is client connected: ${mqttClient.connected}`);
    // mqttClient.subscribe('chat-alive')
    mqttClient.subscribe('/1-1')
})
mqttClient.on('close', function () {
    console.log('MQTT close OK')
})
mqttClient.on("error",function(error) {
    console.log("Can't connect MQTT "+ error)
})
mqttClient.on('message',(topic, message) => {
    console.log(topic)
    console.log(JSON.parse(message))
});
function pushMQTT(topics, message) {
    if(mqttClient)
    {
        for(let t of topics)
        {
            try
            {
                mqttClient.publish(t, message)
            }
            catch (e) {
                console.log(e)
            }

        }
        console.log('MQTT push OK')
    }
    else
    {
        console.log('Please wait mqtt connect')
    }
}

