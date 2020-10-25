import { createStore } from "vuex";
import random from "lodash.random";
import shuffle from "lodash.shuffle";
import cloneDeep from "lodash.clonedeep";
import isArray from "lodash.isarray";
import isEqual from "lodash.isequal";
import toastr from "toastr";

toastr.options = {
  closeButton: true,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-bottom-center",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};

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
    cardById(state) {
      return state.cards.reduce(
        (result, card) => ({
          ...result,
          [card.id]: card
        }),
        {}
      );
    },
    stateCards(state) {
      return state.state[0];
    },
    stateSlots(state) {
      return state.state[1];
    },
    cardIds(state) {
      return state.cards.map(card => card.id);
    },
    cardsLength(state) {
      return state.cards.length;
    },
    valueByPosition(state) {
      const result = {};
      for (const [listIndex, list] of state.state.entries()) {
        for (const [itemIndex, item] of list.entries()) {
          result[`${listIndex}-${itemIndex}`] = item;
        }
      }
      return result;
    },
    positionByCardId(state) {
      const result = {};
      for (const [listIndex, list] of state.state.entries()) {
        for (const [itemIndex, item] of list.entries()) {
          if (item) {
            result[item] = `${listIndex}-${itemIndex}`;
          }
        }
      }
      return result;
    },
    winStatus(state, getters) {
      // check if positions are correct
      return isEqual(
        state.state[1].map(cardId => getters.cardById[cardId]?.type),
        getters.cardIds.map(cardId => getters.cardById[cardId]?.type)
      );
    }
  },
  mutations: {
    SET_TIME_SPEND(state, { payload }) {
      state.timeSpend = payload;
    },
    SET_USER_NAME(state, payload) {
      state.userName = payload;
    },
    SET_STATE(state, { payload }) {
      if (isArray(payload)) {
        state.state = payload;
        return;
      }
      const { cards, slots } = payload;
      state.state = [cards || state.state[0], slots || state.state[1]];
    },
    SET_DIRTY(state, payload) {
      state.dirty = payload;
    }
  },
  actions: {
    moveCard({ state, commit, getters }, { cardId, position }) {
      //Switch cards
      const [cardNextX, cardNextY] = position.split("-");
      const valueInCardNextPosition =
        getters.valueByPosition[`${cardNextX}-${cardNextY}`];
      const cardPosition = getters.positionByCardId[cardId];
      const [cardX, cardY] = cardPosition.split("-");
      const hasDroppedInWrongSlot = parseInt(cardNextX) === 0;
      const hasDroppedInSlot =
        parseInt(cardX) === 0 && parseInt(cardNextX) === 1;
      const hasDroppedInEmptySlot = valueInCardNextPosition === null;
      const hasDroppedInCorrectSlot =
        parseInt(cardNextX) === 1 &&
        getters.cardById[getters.cardIds[cardNextY]]?.type ===
          getters.cardById[cardId]?.type;
      debugger;
      const prevState = cloneDeep(state.state);
      const newState = cloneDeep(state.state);
      newState[cardNextX][cardNextY] = cardId;
      newState[cardX][cardY] = valueInCardNextPosition;
      commit({
        type: "SET_STATE",
        payload: newState
      });

      if (
        hasDroppedInWrongSlot ||
        (hasDroppedInSlot && !hasDroppedInEmptySlot)
      ) {
        //The user can drop the card only to the empty slot,
        //in the other case, the card goes back to the previous position.
        setTimeout(() => {
          //TODO:
          toastr.error("Slot is not empty!");
          commit({
            type: "SET_STATE",
            payload: prevState
          });
        }, 0);
        return;
      }

      if (!hasDroppedInCorrectSlot) {
        //If the user drops the card to the incorrect slot
        //the time should be increased by 10 seconds.
        setTimeout(() => {
          toastr.error("Incorrect slot :c");
          commit({
            type: "SET_TIME_SPEND",
            payload: state.timeSpend + 10
          });
        }, 0);
      }
    },
    restart({ state, commit }) {
      commit("SET_DIRTY", false);
      commit({
        type: "SET_TIME_SPEND",
        payload: 0
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

const store = createStore({
  modules: {
    game: gameModule
  }
});
let intervalId;

store.subscribe(async mutation => {
  if (mutation.type === "game/SET_USER_NAME") {
    //Start game
    store.dispatch("game/restart");
  }
  if (mutation.type === "game/SET_STATE") {
    //Restart game if win after 10 seconds
    const winStatus = await store.getters["game/winStatus"];
    if (winStatus) {
      toastr.success("You win");
      clearInterval(intervalId);
      setTimeout(() => {
        store.dispatch("game/restart");
      }, 10000);
    }
  }
  if (mutation.type === "game/SET_DIRTY") {
    //Start counting score
    if (mutation.payload && !intervalId) {
      intervalId = setInterval(() => {
        store.commit({
          type: "game/SET_TIME_SPEND",
          payload: store.state.game.timeSpend + 1
        });
      }, 1000);
    } else if (!mutation.payload) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
});

export default store;

if (module.hot) {
  module.hot.accept(() => {
    store.hotUpdate({
      modules: {
        gameModule
      }
    });
  });
}
