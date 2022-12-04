<script setup lang="ts">
import { ref, computed, watch } from "vue";
import MsGame from "./components/MsGame.vue";
import ScoreModal from "./components/ScoreModal.vue";
import { useScoreStore } from "@/stores/score";
import { useMinesweeperStore } from "@/stores/minesweeper";
import type { Score } from "@/stores/score";

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
  return minesweeperStore.game == 3;
});
const gameTime = computed((): number => {
  return minesweeperStore.playTime;
});
const recordClearTime = (score: Score): void => {
  const promise = scoreStore.addScore(score);
  promise.then((result: boolean) => {
    if (result) {
      showModal();
    }
  });
  promise.catch((error) => {
    console.log("登録失敗しました。", error);
  });
};

const recordScore = (): Score => {
  const score: Score = { level: "", time: 0, date: "" };
  score.level = minesweeperStore.gameLevel.level;
  score.time = gameTime.value;
  const year = new Date().getFullYear().toString();
  const month = (new Date().getMonth() + 1).toString();
  const day = new Date().getDate().toString();
  score.date = year + "/" + month + "/" + day;
  return score;
};

watch(isWin, (): void => {
  if (isWin.value) {
    scoreStore.prepareScoreList();
    recordScore();
    recordClearTime(recordScore());
  }
});

scoreStore.prepareScoreList();
const scoreList = computed((): Map<number, Score> => {
  return scoreStore.scoreList;
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
    :time="gameTime"
    :isWin="isWin"
    :scoreList="scoreList"
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
