<script setup lang="ts">
import { ref, computed } from "vue";
import MsGame from "./components/MsGame.vue";
import ScoreModal from "./components/ScoreModal.vue";
import { useScoreStore } from "@/stores/score";
import { useMinesweeperStore } from "@/stores/minesweeper";

const scoreStore = useScoreStore();
const minesweeperStore = useMinesweeperStore();

let modalVisible = ref(false);
const showModal = (): void => {
  modalVisible.value = true;
};
const closeModal = (): void => {
  modalVisible.value = false;
};
const isLoading = computed((): boolean => {
  return scoreStore.isLoading;
});

const isWin = computed((): boolean => {
  return minesweeperStore.game === 3;
});
const time = computed((): number => {
  return minesweeperStore.playTime;
});
</script>

<template>
  <h1 class="title">Vue-Minesweeper</h1>
  <div class="content">
    <MsGame />
  </div>
  <button @click="showModal()">score</button>
  <score-modal
    :isVisible="modalVisible"
    :isLoading="isLoading"
    @close="closeModal"
    :time="time"
    :isWin="isWin"
  ></score-modal>
</template>

<style scoped>
.title {
  height: 50px;
  color: rgb(64, 215, 59);
  text-align: center;
}
.content {
  display: flex;
  justify-content: center;
  max-width: 640px;
  margin: 0 auto;
}
button {
  left: 50%;
  transform: translateX(-50%);
}
</style>
