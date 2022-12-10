<script setup lang="ts">
import { computed } from "vue";
import { useMinesweeperStore } from "@/stores/minesweeper";
import MsStatusBox from "./MsStatusBox.vue";

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
    <MsStatusBox :title="'mines'">
      <p v-if="game === 0 || game === 1">
        {{ mines }}
      </p>
      <p v-if="game === 2">LOSE</p>
      <p v-if="game === 3">WIN</p>
    </MsStatusBox>
    <div class="button" @click="reset">RESET</div>
    <MsStatusBox :title="'time'">
      {{ time }}
    </MsStatusBox>
  </div>
</template>

<style scoped>
.status {
  display: flex;
  justify-content: space-between;
}

.button {
  display: grid;
  place-items: center;
  height: 50px;
  width: 50px;
  font-size: 6px;
  background-color: #fff;
  color: black;
  border: 1px solid black;
}
.button:hover {
  cursor: pointer;
  background-color: #40d73c;
  color: #fff;
}
</style>
