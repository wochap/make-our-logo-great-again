<template>
  <div
    :style="{ backgroundColor: bgColor }"
    @dragenter.prevent="onDragEnter"
    @dragleave="onDragLeave"
    @dragover.prevent
    @drop.stop="onDrop"
    class="card"
  ></div>
</template>

<script>
export default {
  props: ["imageUrl", "position", "droppable"],
  data() {
    return {
      bgColor: null
    };
  },
  methods: {
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
    }
  }
};
</script>

<style scoped lang="scss">
@import "../styles/base";

.card {
  @include card();

  border: 2px dashed #76ebcd;
  background-color: #f5f6f9;
}
</style>
