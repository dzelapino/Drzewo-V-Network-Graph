<template>
  <Header />
  <div class="ContentWrapper">
    <!-- <div class="ChatWrapper">
      <Chat />
      <User />
    </div> -->
    <div class="RouterWrapper">
      <router-view />
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Chat from "@/components/Chat.vue";
import User from "@/components/User.vue";

export default {
  name: "HomeView",
  components: {
    Header,
    Footer,
    Chat,
    User,
  },
};
</script>

<style>
html,
body {
  height: 100vh;
  width: 100vw;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  flex-grow: grow;
  justify-content: space-between;
  height: inherit;
  width: inherit;
}

.ContentWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.RouterWrapper {
  width: 80%;
}
</style>
