<template>
  <main class="container">
    <GameHeader />
    <div class="wrapper">
      <ul class="cards">
        <li v-for="(cardId, index) in stateCards" :key="`${cardId}-${index}`">
          <GameCard
            v-if="cardId"
            :cardId="cardId"
            :imageUrl="imgUrlByCardType[cardById[cardId].type]"
            :position="`${0}-${index}`"
            @dragStart="setDirty(true)"
          ></GameCard>
          <GameCardSlot v-else :position="`${0}-${index}`"></GameCardSlot>
        </li>
      </ul>
      <p class="instructions">
        ...and drop them here to make the logo great again!
      </p>
      <ul class="cards" :style="{ pointerEvents: winStatus ? 'none' : null }">
        <li v-for="(cardId, index) in stateSlots" :key="`${cardId}-${index}`">
          <GameCard
            v-if="cardId"
            :cardId="cardId"
            :imageUrl="imgUrlByCardType[cardById[cardId].type]"
            :position="`${1}-${index}`"
            @drop="onDrop"
            :droppable="true"
          ></GameCard>
          <GameCardSlot
            v-else
            @drop="onDrop"
            :position="`${1}-${index}`"
            :droppable="true"
          ></GameCardSlot>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
import GameHeader from "./GameHeader";
import GameCard from "./GameCard";
import GameCardSlot from "./GameCardSlot";
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    GameHeader,
    GameCard,
    GameCardSlot
  },
  computed: {
    ...mapGetters("game", [
      "stateCards",
      "stateSlots",
      "cardById",
      "winStatus"
    ]),
    ...mapState("game", ["imgUrlByCardType"])
  },
  methods: {
    ...mapMutations("game", {
      setDirty: "SET_DIRTY"
    }),
    ...mapActions("game", ["moveCard"]),
    onDrop({ cardId, position }) {
      if (!cardId) {
        //TODO: fix bug
        return;
      }
      debugger;
      this.moveCard({ cardId, position });
    }
  }
};
</script>

<style scoped lang="scss">
@import "../styles/base";

.wrapper {
  @include wrapper();
}

.cards {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
  justify-content: space-between;

  li {
    list-style: none;
  }
}

.instructions {
  @include p();
  margin: 1em 0;
}
</style>
