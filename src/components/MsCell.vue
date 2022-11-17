<script setup lang="ts">
interface Emits {
  (event: "leftClick"): void;
}
interface Props {
  open: boolean;
}
defineProps<Props>();
const emit = defineEmits<Emits>();
const leftClick = (): void => {
  emit("leftClick");
};
</script>

<template>
  <div class="cell" :class="{ open: open }" @click="leftClick"><slot /></div>
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
  background-color: red;
}
</style>
