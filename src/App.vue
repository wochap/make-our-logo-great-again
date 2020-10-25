<template>
  <GameScreen v-if="userName" />
  <WelcomeScreen v-else />
</template>

<script>
import GameScreen from "./components/GameScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import { mapState } from "vuex";

export default {
  components: {
    GameScreen,
    WelcomeScreen
  },
  computed: {
    ...mapState("game", ["userName"])
  }
};
</script>

<style lang="scss">
@import "~sanitize.css";
@import "~toastr/build/toastr.min.css";
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;1,400&display=swap");

body {
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 400;
}

[draggable] {
  user-select: none;
}
</style>
