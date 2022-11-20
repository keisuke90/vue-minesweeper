<script setup lang="ts">
interface Emits {
  (event: "leftClick"): void;
  (event: "rightClick"): void;
}
interface Props {
  open: boolean;
  flag: boolean;
  mine: boolean;
  count: number;
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
    :class="{ open: open }"
    @click="leftClick"
    @click.right.prevent="rightClick"
  >
    <span v-if="flag">🚩</span>
    <span v-if="mine && open">💣</span>
    <span v-if="open && !mine">{{ count }}</span>
  </div>
</template>

<style scoped>
.cell {
  height: 30px;
  width: 30px;
  border: 1px solid white;
  background-color: black;
}

.cell.open {
  background-color: gray;
}
</style>
