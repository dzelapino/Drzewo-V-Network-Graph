<template>
  <div class="LoginWrapper">
    <div class="LoginForm" v-if="!$store.state.authorized">
      <label for="username">Username</label>
      <input id="username" type="text" v-model="username" />
      <label for="password">Password</label>
      <input id="password" type="password" v-model="password" />
      <button
        :disabled="!username && !password"
        class="LoginButton"
        @click="login"
      >
        Login
      </button>
    </div>
    <div class="LoginForm" v-else>
      Hello mr. {{ $store.state.username }} Your neo id is:
      {{ $store.state.neoId }} Your id is: {{ $store.state.userId }}
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    username: "",
    password: "",
    message: "",
    url: process.env.VUE_APP_API_URL,
  }),
  methods: {
    async login() {
      const auth = { username: this.username, password: this.password };
      try {
        console.log(auth);
        const res = await this.$axios
          .post("/users/login", auth)
          .then((res) => res.data);
        console.log(res);
        if (res.isAuthenticated == true) {
          this.$store.commit("setAuthorized", res.isAuthenticated);
          this.$store.commit("setUsername", res.username);
          this.$store.commit("setUserId", res.id);
          this.$store.commit("setNeoId", res.neoId);
          this.message = "";
        }
      } catch (err) {
        this.message = "Incorrect login data";
        console.log("Unauthorized");
      }
    },
  },
};
</script>

<style scoped>
.LoginWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rebeccapurple;
  height: 20vh;
}
.LoginForm {
  background-color: cyan;
  display: flex;
  flex-direction: column;
}
</style>