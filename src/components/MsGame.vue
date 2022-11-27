<script setup lang="ts">
import MsField from "./MsField.vue";
import MsStatusBar from "./MsStatusBar.vue";
import { useMinesweeperStore } from "@/stores/minesweeper";

const miensweeperStore = useMinesweeperStore();
miensweeperStore.initGame();
const changeGameLevel = (level: string): void => {
  miensweeperStore.changeGameLevel(level);
};
</script>

<template>
  <div class="game">
    <MsStatusBar />
    <MsField />
    <ul class="buttons">
      <li>
        <button class="button" @click="changeGameLevel('easy')">EASY</button>
      </li>
      <li>
        <button class="button" @click="changeGameLevel('normal')">
          NORMAL
        </button>
      </li>
      <li>
        <button class="button" @click="changeGameLevel('hard')">HARD</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.game {
  user-select: none;
  width: fit-content;
}
.buttons {
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  padding: 0;
}
</style>
