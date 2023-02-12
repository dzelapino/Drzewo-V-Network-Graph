<template>
  <div class="Home">
    <div class="HomeContent">
      <img alt="Dzelapino logo" src="../assets/logo.png" />
      <div class="LoggedInAs" v-if="$store.state.username">
        Hello {{ $store.state.username }}!
      </div>
      <div class="LoggedInAs" v-else>Not logged</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.Home {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.HomeContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: lightcyan;
  font-size: larger;
  color: black;
  border: 5px solid lightcyan;
  border-radius: 1%;
  width: 50%;
  box-shadow: 1px 1px 12px 1px black;
}
img {
  max-width: 400px;
  max-height: auto;
}
</style>