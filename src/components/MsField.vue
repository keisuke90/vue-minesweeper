<script setup lang="ts">
import { computed } from "vue";
import MsCell from "./MsCell.vue";
import { useMinesweeperStore } from "@/stores/minesweeper";

const miensweeperStore = useMinesweeperStore();
miensweeperStore.initGame();
const field = computed((): any[] => {
  return miensweeperStore.field;
});
const open = (x: number, y: number): void => {
  miensweeperStore.openCell(x, y);
};
const flag = (x: number, y: number): void => {
  miensweeperStore.flagCell(x, y);
};
const openArroundCell = (x: number, y: number): void => {
  miensweeperStore.openArroundCells(x, y);
};
const game = computed((): number => {
  return miensweeperStore.game;
});
const changeHard = (): void => {
  miensweeperStore.changeHard();
};
</script>

<template>
  <div class="field">
    <div class="row" v-for="(rows, y) in field" :key="y">
      <MsCell
        v-for="(cell, x) in rows"
        :key="x"
        :open="cell.isOpen"
        :flag="cell.isFlag"
        :mine="cell.isMine"
        :count="cell.count"
        :game="game"
        @leftClick="open(x, y)"
        @rightClick="
          flag(x, y);
          openArroundCell(x, y);
        "
      >
      </MsCell>
    </div>
  </div>
  <button class="button" @click="changeHard()">hard</button>
</template>

<style scoped>
.field {
  height: 100%;
  width: 100%;
}
.row {
  display: flex;
  justify-content: center;
  height: 30px;
}
</style>
