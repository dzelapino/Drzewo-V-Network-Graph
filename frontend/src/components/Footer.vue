<template>
  <div class="FooterWrapper">
    <a> Made by dzelapino™ </a>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
#footer {
  position: sticky;
  bottom: 0;
}
.FooterWrapper {
  display: flex;
  background-color: rgb(101, 101, 153);
  align-items: center;
  justify-content: space-evenly;
  font-size: 1.2rem;
  border-top: solid 5px black;
}
a {
  color: white;
  font-size: larger;
  font-weight: bolder;
  padding: 5px;
  text-shadow: 1px 1px black;
}
</style>