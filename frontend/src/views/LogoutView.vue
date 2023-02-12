<template>
  <div class="LogoutWrapper">
    <div class="LogoutContent">
      <div>Logout page</div>
      <div v-if="$store.state.authorized">
        Are you sure you want to log out?
      </div>
      <div v-else>You have successfully logged out</div>
    </div>
    <button v-if="$store.state.authorized" class="LogoutButton" @click="logout">
      Logout
    </button>
  </div>
</template>

<script>
export default {
  data: () => ({
    message: "",
  }),
  methods: {
    async logout() {
      try {
        const res = await this.$axios
          .get("/users/logout")
          .then((res) => res.data);
        console.log(res);
        if (res.success == true) {
          this.$store.commit("setAuthorized", false);
          this.$store.commit("setUsername", "");
          this.$store.commit("setUserId", "");
        }
      } catch (err) {
        this.message = "Error while logging out";
        // this.error = err.message;
      }
    },
  },
};
</script>

<style scoped>
.LogoutWrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.LogoutContent {
  background: lightcyan;
  width: 30%;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 12px 1px black;
  font-size: larger;
  font-weight: bold;
  border-radius: 2.5%;
  gap: 15px;
  padding-top: 20px;
  padding-bottom: 20px;
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
</style>