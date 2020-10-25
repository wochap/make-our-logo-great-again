import { set as vueSet } from "vue";
import { createStore } from "vuex";
import random from "lodash.random";
import shuffle from "lodash.shuffle";
import cloneDeep from "lodash.clonedeep";
import isArray from "lodash.isarray";
import isEqual from "lodash.isequal";

const gameModule = {
  namespaced: true,
  state: () => ({
    imgUrlByCardType: {
      Z:
        "https://drive.google.com/uc?export=view&id=1bJn7SNOSn0NIO88VS64iG69nHlk-9YQ6",
      O:
        "https://drive.google.com/uc?export=view&id=1nZU5N6CdhvySSLLH-jHB8fkpTm0B3W9y",
      V:
        "https://drive.google.com/uc?export=view&id=1XsjPXel2_uHLONBzkC9Xo1vmp6fBa9td",
      U:
        "https://drive.google.com/uc?export=view&id=1vmxm4yYFmFt8LhyfYtnsCZiB2_jcVqif"
    },
    cards: [
      {
        id: random(0, 9999),
        type: "Z"
      },
      {
        id: random(0, 9999),
        type: "O"
      },
      {
        id: random(0, 9999),
        type: "O"
      },
      {
        id: random(0, 9999),
        type: "V"
      },
      {
        id: random(0, 9999),
        type: "U"
      }
    ],

    // Time in seconds
    timeSpend: 0,

    userName: "",

    //Second array represents slots
    state: [new Array(5).fill(null), new Array(5).fill(null)],

    dirty: false
  }),
  getters: {
    cardIds(state) {
      return state.cards.map(card => card.id);
    },
    cardsLength(state) {
      return state.cards.length;
    },
    valueByPosition(state) {
      const result = {};
      for (const [listIndex, list] of state.state.entries()) {
        for (const [itemIndex, item] of list) {
          result[`${listIndex}-${itemIndex}`] = item;
        }
      }
      return result;
    },
    positionByCardId(state) {
      const result = {};
      for (const [listIndex, list] of state.state.entries()) {
        for (const [itemIndex, item] of list) {
          if (item) {
            result[item] = `${listIndex}-${itemIndex}`;
          }
        }
      }
      return result;
    }
  },
  mutations: {
    SET_TIME_SPEND(state, payload) {
      state.timeSpend = payload;
    },
    SET_USER_NAME(state, payload) {
      state.userName = payload;
    },
    SET_STATE(state, payload) {
      if (isArray(payload)) {
        vueSet(state.state, payload);
        return;
      }
      const { cards, slots } = payload;
      if (cards) {
        vueSet(state.state, 0, cards);
      }
      if (slots) {
        vueSet(state.state, 1, slots);
      }
    },
    SET_DIRTY(state, payload) {
      state.dirty = payload;
    }
  },
  actions: {
    moveCard({ state, commit, getters }, { cardId, position }) {
      //Switch values
      const [cardNextX, cardNextY] = position.split("-");
      const valueInCardNextPosition =
        getters.valueByPosition[`${cardNextX}-${cardNextY}`];
      const cardPosition = getters.positionByCardId[cardId];
      const [cardX, cardY] = cardPosition.split("-");
      const prevState = cloneDeep(state.state);
      const newState = cloneDeep(state.state);
      newState[cardNextX][cardNextY] = cardId;
      newState[cardX][cardY] = valueInCardNextPosition;
      commit({
        type: "SET_STATE",
        payload: newState
      });

      const hasDroppedInWrongSlot = parseInt(cardNextX) === 0;
      const hasDroppedInSlot =
        parseInt(cardX) === 0 && parseInt(cardNextX) === 1;
      const hasDroppedInEmptySlot = valueInCardNextPosition === null;
      const hasDroppedInCorrectSlot =
        cardNextX === 1 && getters.cardIds[cardNextY] === cardId;

      if (
        hasDroppedInWrongSlot ||
        (hasDroppedInSlot && !hasDroppedInEmptySlot)
      ) {
        //The user can drop the card only to the empty slot,
        //in the other case, the card goes back to the previous position.
        //TODO: show error message
        commit({
          type: "SET_STATE",
          payload: prevState
        });
        return;
      }

      if (!hasDroppedInCorrectSlot) {
        //If the user drops the card to the incorrect slot
        //the time should be increased by 10 seconds.
        commit({
          type: "SET_TIME_SPEND",
          payload: state.timeSpend + 10
        });
      }
    },
    getWinStatus({ state, getters }) {
      // check if positions are correct
      return isEqual(state.state[1], getters.cardIds);
    },
    restart({ state, commit }) {
      commit({
        type: "SET_DIRTY",
        PAYLOAD: false
      });
      commit({
        type: "SET_TIME_SPEND",
        PAYLOAD: 0
      });
      commit({
        type: "SET_STATE",
        payload: {
          slots: new Array(5).fill(null),
          cards: shuffle(state.cards.map(card => card.id))
        }
      });
    }
  }
};

//TODO: refactor, create game module
const store = createStore({
  modules: {
    game: gameModule
  }
});
let intervalId;

store.subscribe(mutation => {
  if (mutation.type === "game/SET_USER_NAME") {
    //Start game
    store.dispatch("game/restart");
  }
  if (mutation.type === "game/SET_STATE") {
    //Restart game if win after 10 seconds
    const winStatus = store.dispatch("game/getWinStatus");
    if (winStatus) {
      setTimeout(() => {
        store.dispatch("game/restart");
      }, 10000);
    }
  }
  if (mutation.type === "game/SET_DIRTY") {
    clearInterval(intervalId);
    if (mutation.payload) {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        store.commit({
          type: "game/SET_TIME_SPEND",
          payload: store.state.game.timeSpend + 1
        });
      }, 1000);
    }
  }
});

export default store;
