<template>
  <div class="ChatComponent">
    <img
      class="ChatWindowButton"
      alt="Chat"
      src="../assets/chat.png"
      @click="openChatWindow"
    />
    <div v-if="$store.state.chatWindow">
      <div v-if="!$store.state.authorized">You need to log in!</div>
      <div class="ChatForm" v-else>
        <label for="message">Message: </label>
        <input id="message" type="text" v-model="message" />
        <button :disabled="!message" @click="send">Send</button>
      </div>
      <div class="ChatMessages">
        <div
          class="ChatMessage"
          v-for="(message, index) in messages"
          v-bind:key="index"
        >
          <div class="MessageUser">
            {{ message.user }}
          </div>
          <div class="MessageContent">
            {{ message.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "Chat",
  data() {
    return {
      message: "",
      socket: {},
      messages: [],
    };
  },
  created() {
    this.socket = io("http://localhost:5000");
    this.socket.on("Global", (message) => {
      this.messages.push(message);
    });
  },
  methods: {
    async send() {
      await this.socket.emit("new_message", {
        channel: "Global",
        user: this.$store.state.username,
        message: this.message,
      });
      this.message = "";
    },
    openChatWindow() {
      this.$store.commit("setChatWindow");
    },
  },
};
</script>

<style scoped>
.ChatComponent {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 70vh;
  background: orange;
  border-right: solid black 5px;
  border-bottom: solid black 5px;
}
.ChatWindowButton {
  font-size: larger;
  height: 20%;
  width: 80%;
}
.ChatWindowButton:hover {
  cursor: pointer;
}
.ChatMessages {
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  position: relative;
  height: 300px;
  gap: 10px;
}
.ChatMessage {
  border: solid 5px black;
  display: flex;
  width: 90%;
  flex-direction: column;
}
.MessageUser {
  color: white;
  display: flex;
  border-bottom: solid 2px black;
}
.MessageContent {
  color: white;
  background-color: red;
  border-right: solid 7px red;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
}
</style>
