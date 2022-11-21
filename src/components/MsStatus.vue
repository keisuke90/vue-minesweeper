<script setup lang="ts">
import { computed } from "vue";
import { useMinesweeperStore } from "@/stores/minesweeper";

const miensweeperStore = useMinesweeperStore();
const reset = (): void => {
  miensweeperStore.initFeild();
};
const mines = computed((): number => {
  return miensweeperStore.mines;
});
const time = computed((): number => {
  return miensweeperStore.time;
});
</script>

<template>
  <div class="status">
    <div class="box">{{ mines }}</div>
    <button @click="reset">reset</button>
    <div class="box">{{ time }}</div>
  </div>
</template>

<style scoped>
.status {
  display: flex;
  justify-content: center;
}
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100px;
  border: 1px black solid;
}
</style>
