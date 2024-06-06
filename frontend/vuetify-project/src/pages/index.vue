<template>
  <div>
    <!-- Иконка сообщения в виде красного кружка -->
    <div class="message-icon" @click="toggleIcons"></div>
    <!-- Синяя иконка -->
    <div v-if="iconsVisible" class="blue-icon" @click="openChat('Чат с тех. поддержкой', 'supportMessages')"></div>
    <!-- Зелёная иконка -->
    <div v-if="iconsVisible" class="green-icon" @click="openChat('Чат бот', 'botMessages')"></div>

    <!-- Мини-чат -->
    <div v-if="isChatOpen" class="mini-chat">
      <div class="chat-header">
        {{ chatTitle }}

        <span class="close-icon" @click="closeChat">×</span>
      </div>
      <div id="chatMessages" class="chat-messages" ref="chatMessages" v-for="(message, index) in chatMessages" :key="index">
        <div class="message" v-if="message[0]===0">{{ message[1] }}</div>
        <div class="messageOtp" v-else>{{ message[1] }}</div>

      </div>
      <div class="input-container">
        <input type="text" v-model="messageInput" @keydown.enter.prevent="sendMessage" placeholder="Введите сообщение...">
        <button class="send-button" @click="sendMessage">&#9650;</button>
      </div>
    </div>
  </div>
</template>

<script>
import mqtt from 'mqtt';

export default {
  data() {
    return {
      mqttClient: mqtt.connect("ws://broker.hivemq.com:8000/mqtt"),
      isChatOpen: false,
      iconsVisible: false,
      chatMessages: [],
      messageInput: '',
      chatTitle: '',
      currentChat: '',
    };
  },

  created() {
    this.mqttClient.subscribe('/test')
    this.mqttClient.on('connect', function () {
      console.log('MQTT connection OK')
      // console.log(`Is client connected: ${this.mqttClient.connected}`);
      // mqttClient.subscribe('chat-alive')
    })
    this.mqttClient.on('close', function () {
      console.log('MQTT close OK')
    })
    this.mqttClient.on("error",function(error) {
      console.log("Can't connect MQTT "+ error)
    })
    this.mqttClient.on('message',(topic, message) => {
      console.log(topic)
      if (JSON.parse(message).otp!=="я"){
        this.chatMessages.push([1,JSON.parse(message).message])
        this.saveMessages();
        this.scrollChatToBottom();
      }
      // console.log(topic.indexOf(chel.value))
      // if (topic.indexOf(chel.value)===1){
      //   console.log(JSON.parse(message))
      // }
      // console.log(JSON.parse(message))
    });
  },

  methods: {
    pushMQTT(topics, message) {
      if(this.mqttClient)
      {
        for(let t of topics)
        {
          try
          {
            this.mqttClient.publish(t, message)
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
    },
    toggleIcons() {
      this.iconsVisible = !this.iconsVisible;
    },
    openChat(title, chatKey) {
      this.chatTitle = title;
      this.currentChat = chatKey;
      this.chatMessages = JSON.parse(localStorage.getItem(chatKey)) || [];
      this.isChatOpen = true;
      this.iconsVisible = false;
    },
    closeChat() {
      this.isChatOpen = false;
      this.saveMessages();
    },
    sendMessage() {
      if (this.messageInput.trim() !== '') {
        this.chatMessages.push([0,this.messageInput.trim()]);
        this.pushMQTT(['/test'],JSON.stringify({message:this.messageInput.trim(),otp:"я"}))
        this.messageInput = '';
        this.saveMessages();
        this.scrollChatToBottom();
      }
    },
    saveMessages() {
      localStorage.setItem(this.currentChat, JSON.stringify(this.chatMessages));
    },
    scrollChatToBottom() {
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    }
  }
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
}

/* Стили для иконки сообщения в виде красного кружка */
.message-icon {
  position: fixed;
  bottom: 80px;
  right: 20px;
  cursor: pointer;
  z-index: 1000;
  width: 60px;
  height: 60px;
  background-color: red;
  border-radius: 50%;
}

/* Стили для синей иконки */
.blue-icon {
  position: fixed;
  bottom: 140px;
  right: 70px;
  cursor: pointer;
  z-index: 1000;
  width: 40px;
  height: 40px;
  background-color: blue;
  border-radius: 50%;
}

/* Стили для зелёной иконки */
.green-icon {
  position: fixed;
  bottom: 100px; /* Изменено */
  right: 90px; /* Изменено */
  cursor: pointer;
  z-index: 1000;
  width: 40px;
  height: 40px;
  background-color: green;
  border-radius: 50%;
}

/* Стили для мини-чата */
.mini-chat {
  display: block;
  position: fixed;
  bottom: 80px;
  right: 10px; /* Изменено */
  width: 360px; /* Изменено */
  height: 470px; /* Изменено */
  background-color: #eaeaea;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 1000;
}

/* Стили для заголовка чата */
.chat-header {
  font-weight: bold;
  text-align: center;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  position: relative;
}

/* Стили для крестика закрытия чата */
.close-icon {
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.3s ease;
  border-radius: 50%;
  padding: 5px;
}

.close-icon:hover {
  background-color: red;
  color: white;
}
/* Стили для текстовых сообщений */
.chat-messages {
  padding: 10px;
  max-height: calc(100% - 120px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.message {
  background-color: #d8d8d8;
  border-radius: 10px;
  padding: 10px;
  margin: 5px 0;
  width: fit-content;
  max-width: 80%;
  align-self: flex-end;
  word-break: break-all;
}
.messageOtp {
  position: absolute;
  left: 0;
  background-color: #d8d8d8;
  border-radius: 10px;
  padding: 10px;
  margin: 5px 0;
  width: fit-content;
  max-width: 80%;
  align-self: flex-end;
  word-break: break-all;
}

/* Стили для контейнера ввода */
.input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
  position: absolute;
  width: 100%;
  bottom: 0;
  background-color: #f5f5f5;
  //margin-top: 15px; /* Опущено на 15 пикселей вниз */
}

.input-container input {
  flex: 1;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 10px;
}

.send-button {
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
}

.send-button:hover {
  background-color: #16a085;
}
</style>
