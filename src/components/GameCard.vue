<template>
  <figure
    :style="{ backgroundColor: bgColor, opacity: opacity }"
    @dragend="onDragEnd"
    @dragenter.prevent="onDragEnter"
    @dragleave="onDragLeave"
    @dragover.prevent
    @dragstart="onDragStart"
    @drop.stop="onDrop"
    class="card"
    draggable="true"
  >
    <img :src="imageUrl" />
  </figure>
</template>

<script>
export default {
  props: ["imageUrl", "cardId", "position", "droppable"],
  data() {
    return {
      bgColor: null,
      opacity: null
    };
  },
  methods: {
    onDragStart(event) {
      this.opacity = 0.5;
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("cardId", this.cardId);
      event.dataTransfer.setData("text/html", "<h1>asdsad</h1>");
      this.$emit("drag-start");
    },
    onDragEnter() {
      if (!this.droppable) {
        return;
      }
      this.bgColor = "yellow";
    },
    onDragLeave() {
      if (!this.droppable) {
        return;
      }
      this.bgColor = null;
    },
    onDrop(event) {
      this.onDragLeave();
      if (!this.droppable) {
        return;
      }
      this.$emit("drop", {
        cardId: event.dataTransfer.getData("cardId"),
        position: this.position
      });
    },
    onDragEnd() {
      this.opacity = null;
      this.bgColor = null;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../styles/base";

.card {
  @include card();

  align-items: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: row;
  justify-content: center;
  cursor: move;

  img {
    pointer-events: none;
  }
}
</style>
