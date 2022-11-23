<script setup lang="ts">
import { computed } from "vue";
import { useMinesweeperStore } from "@/stores/minesweeper";

const miensweeperStore = useMinesweeperStore();
const reset = (): void => {
  miensweeperStore.initGame();
};
const mines = computed((): number => {
  return miensweeperStore.remaining;
});
const time = computed((): number => {
  return miensweeperStore.playTime;
});
const game = computed((): number => {
  return miensweeperStore.game;
});
</script>

<template>
  <div class="status">
    <div class="box">
      <p v-if="game === 0 || game === 1">
        {{ mines }}
      </p>
      <p v-if="game === 2">LOSE</p>
    </div>
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
