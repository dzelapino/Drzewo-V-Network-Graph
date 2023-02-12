<template>
  <div class="ChatComponent">
    <div class="RoomDetails">
      <div class="RoomMessage">Room:</div>
      <div class="RoomName">
        {{ this.$store.state.privateChat }}
      </div>
    </div>
    <div class="RoomContent">
      <div class="ChatForm">
        <input id="message" type="text" v-model="message" />
        <button :disabled="!message" @click="send">Send Message</button>
      </div>
      <div class="ChatMessages">
        <div
          class="ChatMessage"
          v-for="(message, index) in messages"
          v-bind:key="index"
        >
          <div class="MessagePic">
            {{ message.user.charAt(0) }}
          </div>
          <div class="MessageContent">
            <div class="MessageUser">
              {{ message.user }}
            </div>
            <div class="MessageMessage">
              {{ message.message }}
            </div>
          </div>
        </div>
        <button @click="loadMoreMessages">Load more messages</button>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "PrivateView",
  data() {
    return {
      message: "",
      socket: {},
      messages: [],
      numberOfMessages: 10,
    };
  },
  created() {
    this.$axios
      .get(
        `/messages/getLastFromChannel/${this.$store.state.privateChat}/${this.numberOfMessages}`
      )
      .then((response) => {
        this.messages = response.data.reverse();
        console.log(response);
      });
    this.socket = io("http://localhost:5000");
    this.socket.on(this.$store.state.privateChat, (message) => {
      this.messages.unshift(message);
    });
  },
  methods: {
    async send() {
      const messageBody = {
        channel: this.$store.state.privateChat,
        user: this.$store.state.username,
        message: this.message,
      };
      await this.socket.emit("new_message", messageBody);
      const res = await this.$axios
        .post(`/messages`, messageBody)
        .then((res) => res.data);
      console.log(res);
      this.message = "";
    },
    openChatWindow() {
      this.$store.commit("setChatWindow");
    },
    async loadMoreMessages() {
      this.numberOfMessages = this.numberOfMessages + 10;
      this.$axios
        .get(
          `/messages/getLastFromChannel/${this.$store.state.privateChat}/${this.numberOfMessages}`
        )
        .then((response) => {
          this.messages = response.data.reverse();
          console.log(response);
        });
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
  gap: 10px;
}
.RoomDetails {
  font-size: 2rem;
  font-weight: bolder;
  color: black;
  border-bottom: solid 10px black;
  display: flex;
  width: 60%;
  justify-content: space-evenly;
}
.RoomContent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 50px;
  justify-content: space-evenly;
}
.ChatForm {
  display: flex;
  width: 60%;
  gap: 20px;
  align-items: center;
  justify-content: center;
}
input {
  background: none;
  font-size: larger;
  color: black;
  border: 5px solid lightcyan;
  border-radius: 5%;
  background: lightcyan;
  width: 50%;
  box-shadow: 1px 1px 12px 1px black;
}
input:focus {
  outline: none;
}
button {
  font-size: larger;
  width: 30%;
  color: black;
  border: 5px solid lightcyan;
  border-radius: 5%;
  background: lightcyan;
  box-shadow: 1px 1px 12px 1px black;
}
button:hover {
  cursor: pointer;
  box-shadow: 1px 1px 12px 5px white;
}
.ChatMessages {
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  position: relative;
  align-items: center;
  height: 70%;
  width: 50%;
  gap: 15px;
  box-shadow: 3px 3px 22px 2px black;
}
.ChatMessage {
  background-color: beige;
  border: solid 15px beige;
  border-radius: 5%;
  display: flex;
  align-items: center;
  width: 80%;
  justify-content: space-between;
  flex-direction: row;
  box-shadow: 1px 1px 12px 1px black;
}
.MessagePic {
  background: rgb(101, 101, 153);
  height: 80px;
  width: 80px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  color: wheat;
  font-weight: bolder;
  font-size: larger;
  text-align: center;
  border: solid black 5px;
  border-radius: 50%;
  box-shadow: 1px 1px 6px 1px black;
}
.MessageContent {
  background-color: rgb(101, 101, 153);
  border: solid rgb(101, 101, 153) 10px;
  border-radius: 3%;
  width: 70%;
  height: auto;
  box-shadow: 1px 1px 6px 1px black;
}
.MessageUser {
  color: black;
  font-weight: bolder;
  font-size: larger;
  display: flex;
  max-height: 50px;
  border-bottom: solid 4px black;
}
.MessageMessage {
  color: black;
  display: flex;
  width: 100%;
  font-weight: bold;
  font-size: large;
  align-items: center;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  max-height: 200px;
  overflow: auto;
}
</style>
