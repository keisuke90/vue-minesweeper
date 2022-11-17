<script setup lang="ts">
import { ref, computed } from "vue";
import MsCell from "./MsCell.vue";
import { useMinesweeperStore } from "@/stores/minesweeper";
import type { Mine } from "@/stores/minesweeper";

const miensweeperStore = useMinesweeperStore();
miensweeperStore.initFeild();
const field = computed((): [Mine[]] => {
  return miensweeperStore.field;
});
const open = (x: number, y: number): void => {
  miensweeperStore.openCell(x, y);
};
</script>

<template>
  <div class="field">
    <div v-for="(rows, y) in field" :key="y">
      <MsCell
        v-for="(cell, x) in rows"
        :key="x"
        :open="cell.isOpen"
        @leftClick="open(x, y)"
        ><span v-if="cell.isOpen">{{ cell.count }}</span></MsCell
      >
    </div>
  </div>
</template>

<style scoped>
.field {
  height: 100%;
  width: 100%;
}
</style>
