const chel= document.getElementById('ima')
const komu= document.getElementById('komu')
const text= document.getElementById('sms')
const butt= document.getElementById('otp')

const mqttClient = mqtt.connect("ws://localhost:9001")


function otpravka() {
    mqttClient.subscribe('/'+komu.value+'-'+chel.value)
    mqttClient.subscribe('/'+chel.value+'-'+komu.value)
    pushMQTT(['/'+komu.value+'-'+chel.value],JSON.stringify({message:text.value}))
}
mqttClient.on('connect', function () {
    console.log('MQTT connection OK')
    console.log(`Is client connected: ${mqttClient.connected}`);
    // mqttClient.subscribe('chat-alive')
})
mqttClient.on('close', function () {
    console.log('MQTT close OK')
})
mqttClient.on("error",function(error) {
    console.log("Can't connect MQTT "+ error)
})
mqttClient.on('message',(topic, message) => {
    console.log(topic)
    console.log(topic.indexOf(chel.value))
    if (topic.indexOf(chel.value)===1){
        console.log(JSON.parse(message))
    }
    // console.log(JSON.parse(message))
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

butt.addEventListener('click',otpravka)
