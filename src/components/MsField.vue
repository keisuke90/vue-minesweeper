<script setup lang="ts">
import { ref, computed } from "vue";
import MsCell from "./MsCell.vue";
import { useMinesweeperStore } from "@/stores/minesweeper";
import type { Mine } from "@/stores/minesweeper";

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
