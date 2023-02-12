<template>
  <div class="ChatWrapper">
    <div class="ChatRoom">
      <div class="ChatJoin">Join private chatroom!</div>
      <div class="ChatForm">
        <label for="chatRoom">Room password: </label>
        <input id="chatRoom" type="text" v-model="chatRoom" />
        <!-- <button :disabled="!chatRoom" @click="changeChatRoom">Change room</button> -->
        <router-link
          to="/private"
          class="Link"
          v-if="$store.state.authorized"
          @click="changeChatRoom"
          :disabled="!chatRoom"
          >Join room</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatView",
  data() {
    return {
      chatRoom: "Global",
    };
  },
  methods: {
    changeChatRoom() {
      this.$store.commit("setPrivateChat", this.chatRoom);
    },
  },
};
</script>

<style scoped>
.ChatWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ChatRoom {
  background: lightsteelblue;
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 1px 1px 12px 1px black;
  font-size: larger;
  font-weight: bold;
  border-radius: 2.5%;
  gap: 15px;
  padding-top: 20px;
  padding-bottom: 20px;
}
.ChatForm {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  padding-top: 20px;
  padding-bottom: 20px;
}
label,
.ChatJoin {
  width: 80%;
  font-size: larger;
  color: black;
}
input {
  background: lightcyan;
  font-size: larger;
  color: black;
  border: 5px solid lightcyan;
  border-radius: 5%;
  width: 50%;
  text-align: center;
  box-shadow: 1px 1px 12px 1px black;
}
input:focus {
  outline: none;
}
.Link {
  font-size: larger;
  width: 50%;
  color: black;
  border: 5px solid lightcyan;
  border-radius: 5%;
  background: lightcyan;
  text-decoration: none;
  box-shadow: 1px 1px 12px 1px black;
}
.Link:hover {
  cursor: pointer;
  box-shadow: 1px 1px 12px 5px white;
}
</style>