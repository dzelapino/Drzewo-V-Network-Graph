<template>
  <div class="RegisterWrapper">
    <div class="RegisterFormWrapper" v-if="created">
      <div class="RegisterForm">
        <div class="RegisterMessage">
          {{ message }}
        </div>
        <div class="RegisterMessage">
          {{ message2 }}
        </div>
        <router-link to="/login" class="Link">Login</router-link>
      </div>
    </div>
    <div class="RegisterFormWrapper" v-else>
      <div class="RegisterForm" v-if="!$store.state.authorized">
        <label for="username">Username</label>
        <input id="username" type="text" v-model="username" />
        <button class="PasswordButton" @click="switchVisibility">
          Password: {{ switchVisibilityMessage }}
        </button>
        <input :type="passwordFieldType" v-model="password" />
        <label for="name">Name</label>
        <input id="name" type="text" v-model="name" />
        <label for="surname">Surname</label>
        <input id="surname" type="text" v-model="surname" />
        <label for="gender">Gender</label>
        <div class="RadioButtons">
          <div class="GenderRadio">
            <input
              class="RadioButton"
              type="radio"
              name="gender"
              value="male"
              v-model="gender"
            />
            <div class="RadioText">Male</div>
          </div>
          <div class="GenderRadio">
            <input
              class="RadioButton"
              type="radio"
              name="gender"
              value="female"
              v-model="gender"
            />
            <div class="RadioText">Female</div>
          </div>
        </div>
        <label for="birthDate">Birth date:</label>
        <input
          type="date"
          name="birth-date"
          min="1700-01-01"
          max="2023-12-31"
          v-model="birthDate"
        />
        <button
          :disabled="!username && !password"
          class="RegisterButton"
          @click="register"
        >
          Register
        </button>
      </div>
    </div>
  </div>
</template>

<script>
//& <!-- name, surname, birthDate, gender -->
export default {
  data: () => ({
    username: "",
    password: "",
    name: "",
    surname: "",
    birthDate: "",
    gender: "male",
    sure: true,
    message: "",
    message2: "",
    created: false,
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
    async register() {
      const personToCreate = {
        name: this.name,
        surname: this.surname,
        birthDate: this.birthDate,
        gender: this.gender,
        sure: this.sure,
      };
      try {
        console.log(personToCreate);
        const resNeo = await this.$axios
          .post("/people/createPerson", personToCreate)
          .then((resNeo) => resNeo.data);
        console.log(resNeo);
        this.message2 = resNeo.message.msgBody;

        const userToRegister = {
          username: this.username,
          password: this.password,
          neoId: resNeo.message.msgPayload,
        };

        console.log(userToRegister);

        const res = await this.$axios
          .post("/users/register", userToRegister)
          .then((res) => res.data);
        console.log(res);
        this.message = res.message.msgBody;
        this.created = true;
      } catch (err) {
        console.log(err.response.data.message.msgBody);
        this.message = err.response.data.message.msgBody;
      }
    },
  },
};
</script>

<style scoped>
.RegisterWrapper {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 20px;
}
.RegisterFormWrapper {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 20px;
  width: 100%;
}
.RegisterForm {
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
.RadioButtons {
  display: flex;
  align-items: center;
  gap: 35px;
}
.RadioButton {
  transform: scale(3);
  box-shadow: none;
}
.RadioButton:checked {
  accent-color: darkviolet;
}
.RadioText {
  padding-top: 15px;
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
.RegisterMessage {
  color: black;
  font-size: larger;
  font-weight: bold;
}
</style>