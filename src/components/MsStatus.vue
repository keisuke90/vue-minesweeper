<script setup lang="ts">
import { useMinesweeperStore } from "@/stores/minesweeper";

const miensweeperStore = useMinesweeperStore();
const reset = (): void => {
  miensweeperStore.initFeild();
};
</script>

<template>
  <button @click="reset">reset</button>
</template>

<style scoped>
.title {
  height: 100px;
  background-color: white;
}
</style>
