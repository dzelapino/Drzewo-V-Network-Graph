<template>
  <div class="HeaderWrapper">
    <router-link to="/login" class="Link" v-if="!$store.state.authorized"
      >Login</router-link
    >
    <router-link to="/logout" class="Link" v-else>Logout</router-link>
    <!-- <router-link to="/private" class="Link" v-if="$store.state.authorized">Private</router-link> -->
    <router-link to="/tree" class="Link">Tree</router-link>
    <router-link to="/" class="Link">Home</router-link>
    <router-link to="/chat" class="Link">Chat</router-link>
    <router-link to="/userList" class="Link">List</router-link>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  created() {
    try {
      const token = this.$cookies.get("access_token");
      const decoded = jwt_decode(token);
      this.$store.commit("setAuthorized", decoded.sub.isAuthenticated);
      this.$store.commit("setUsername", decoded.sub.username);
      this.$store.commit("setUserId", decoded.sub.id);
      this.$store.commit("setNeoId", decoded.sub.neoId);
    } catch (error) {}
  },
};
</script>

<style scoped>
#header {
  position: sticky;
  top: 0;
}
.HeaderWrapper {
  display: flex;
  background-color: rgb(101, 101, 153);
  align-items: center;
  color: white;
  justify-content: space-evenly;
  font-size: 1.3rem;
  border-bottom: solid 5px rgb(101, 101, 153);
  padding: 5px;
  box-shadow: 1px 1px 6px 5px black;
}
.Link {
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: larger;
  text-shadow: 1px 1px black;
}
.Link:hover {
  cursor: pointer;
  color: lightgreen;
}
</style>