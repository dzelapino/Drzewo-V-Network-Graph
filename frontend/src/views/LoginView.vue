<template>
  <div class="LoginWrapper">
    <div class="LoginMessage">
      {{ message }}
    </div>
    <div class="LoginForm" v-if="!$store.state.authorized">
      <label for="username">Username</label>
      <input id="username" type="text" v-model="username" />
      <button class="PasswordButton" @click="switchVisibility">
        Password: {{ switchVisibilityMessage }}
      </button>
      <input :type="passwordFieldType" v-model="password" />
      <button
        :disabled="!username && !password"
        class="LoginButton"
        @click="login"
      >
        Login
      </button>
      <router-link to="/register" class="Link">Register</router-link>
    </div>
    <div class="LoginForm" v-else>Hello {{ $store.state.username }}</div>
  </div>
</template>

<script>
export default {
  data: () => ({
    username: "",
    password: "",
    message: "",
    url: process.env.VUE_APP_API_URL,
    passwordFieldType: "password",
    switchVisibilityMessage: "Show",
  }),
  methods: {
    switchVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
      this.switchVisibilityMessage =
        this.switchVisibilityMessage === "Show" ? "Hide" : "Show";
    },
    async login() {
      const auth = { username: this.username, password: this.password };
      try {
        // console.log(auth);
        const res = await this.$axios
          .post("/users/login", auth)
          .then((res) => res.data);
        // console.log(res);
        if (res.isAuthenticated == true) {
          this.$store.commit("setAuthorized", res.isAuthenticated);
          this.$store.commit("setUsername", res.username);
          this.$store.commit("setUserId", res.id);
          this.$store.commit("setNeoId", res.neoId);
          this.message = "";
        }
      } catch (err) {
        this.message = "Incorrect login data";
        // this.error = err.message;
      }
    },
  },
};
</script>

<style scoped>
.LoginWrapper {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 20px;
}
.LoginMessage {
  color: black;
  font-size: larger;
  font-weight: bold;
}
.LoginForm {
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
label {
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
.PasswordButton {
  color: black;
  border: none;
  background: none;
  box-shadow: none;
  font-size: larger;
  font-weight: bold;
  width: 80%;
}
.PasswordButton:hover {
  box-shadow: none;
  color: darkviolet;
}
.Link {
  text-decoration: none;
  color: black;
  font-weight: bold;
  font-size: large;
}
.Link:hover {
  color: darkviolet;
}
</style>