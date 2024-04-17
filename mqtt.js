const axios = require('axios');
const mqttOptions = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    keepalive: 0,
};
const mqtt = require('mqtt');
const mqttClient = mqtt.connect( mqttOptions)
mqttClient.on('connect', function () {
    console.log('MQTT connection OK')
    console.log(`Is client connected: ${mqttClient.connected}`);
    // mqttClient.subscribe('chat-alive')
    mqttClient.subscribe('/test')
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

pushMQTT(['/test'],JSON.stringify({message:'fuck you'}))
axios.post('http://127.0.0.1:8000/api/chat/create',{
    userId:1,
    messageValue:"fuck you",
    fromUserId:1
})