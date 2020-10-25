<template>
  <main class="container">
    <form class="wrapper" @submit.prevent="setUserName(name)" action="!#">
      <label class="title" for="WelcomeScreen:name"
        >Hello friend, tell me your name...</label
      >
      <input
        class="input"
        id="WelcomeScreen:name"
        type="text"
        name="name"
        placeholder="Your name here"
        required
        v-model="name"
      />
      <button class="button" type="submit">Let's go -></button>
    </form>
  </main>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      name: ""
    };
  },
  methods: {
    ...mapMutations("game", {
      setUserName: "SET_USER_NAME"
    })
  }
};
</script>

<style scoped lang="scss">
@import "../styles/base";

.container {
  @include flexCenter();
}

.wrapper {
  @include wrapper();

  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: auto;
}

.title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1.5em;
}

.input {
  appearance: none;
  border: 0;
  border-bottom: 1px solid rgba(#505050, 0.2);
  color: #505050;
  display: block;
  font-family: inherit;
  margin-bottom: 2.5em;
  max-width: 300px;
  padding: 0.75em;
  text-align: center;
  width: 100%;

  &::placeholder {
    font-style: italic;
  }
}

.button {
  appearance: none;
  background-color: #fff;
  border-radius: 9999px;
  border: 1px solid rgba(#505050, 0.2);
  color: #4a2781;
  font-family: inherit;
  font-weight: 500;
  padding: 0.5em 1em;
}
</style>
