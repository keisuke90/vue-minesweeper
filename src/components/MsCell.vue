<script setup lang="ts">
interface Emits {
  (event: "leftClick"): void;
  (event: "rightClick"): void;
}
interface Props {
  open: boolean;
  flag: boolean;
}
defineProps<Props>();
const emit = defineEmits<Emits>();
const leftClick = (): void => {
  emit("leftClick");
};
const rightClick = (): void => {
  emit("rightClick");
};
</script>

<template>
  <div
    class="cell"
    :class="{ open: open, flag: flag }"
    @click="leftClick"
    @click.right.prevent="rightClick"
  >
    <slot />
  </div>
</template>

<style scoped>
.cell {
  display: inline-block;
  height: 30px;
  width: 30px;
  border: 1px solid white;
  background-color: black;
}

.cell.open {
  background-color: gray;
}
.cell.flag {
  background-color: green;
}
</style>
