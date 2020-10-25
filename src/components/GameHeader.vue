.<template>
  <header class="header">
    <div class="left">
      <p class="title">Good luck, {{ userName }}!</p>
      <p>Pick up the right cards</p>
    </div>
    <div class="right">
      <p class="score">Your score: {{ timeSpend }} seconds</p>
      <p>The faster, the better!</p>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  computed: {
    ...mapState("game", ["userName", "timeSpend"]),
    ...mapGetters("game", {})
  }
};
</script>

<style lang="scss">
@import "../styles/base";

.header {
  @include wrapper();
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.title {
  color: #000000;
  font-size: 1em;
  margin-bottom: 1em;
  text-align: left;
}

.score {
  color: $color-primary;
  font-size: 1em;
  margin-bottom: 1em;
  text-align: right;
}

.right {
  text-align: right;
}

p {
  @include p();
}
</style>
