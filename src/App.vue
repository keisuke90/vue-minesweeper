<script setup lang="ts">
import { ref, computed, watch } from "vue";
import MsGame from "./components/MsGame.vue";
import ScoreModal from "./components/ScoreModal.vue";
import { useScoreStore } from "@/stores/score";
import { useMinesweeperStore } from "@/stores/minesweeper";
import type { Score, Record } from "@/stores/score";

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

const recordBestScore = (): void => {
  if (minesweeperStore.gameLevel.level === "easy") {
    if (scoreStore.recordTime.easy == null) {
      scoreStore.recordTime.easy = gameTime.value;
      return;
    }
    scoreStore.recordTime.easy =
      gameTime.value > scoreStore.recordTime.easy
        ? scoreStore.recordTime.easy
        : gameTime.value;
  } else if (minesweeperStore.gameLevel.level === "normal") {
    if (scoreStore.recordTime.normal == null) {
      scoreStore.recordTime.normal = gameTime.value;
      return;
    }
    scoreStore.recordTime.easy =
      gameTime.value > scoreStore.recordTime.normal
        ? scoreStore.recordTime.normal
        : gameTime.value;
  } else {
    if (scoreStore.recordTime.hard == null) {
      scoreStore.recordTime.hard = gameTime.value;
      return;
    }
    scoreStore.recordTime.easy =
      gameTime.value > scoreStore.recordTime.hard
        ? scoreStore.recordTime.hard
        : gameTime.value;
  }
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
    recordBestScore();
    scoreStore.prepareScoreList();
    recordScore();
    recordClearTime(recordScore());
  }
});

scoreStore.prepareScoreList();
const scoreList = computed((): Map<number, Score> => {
  return scoreStore.scoreList;
});
const recordTime = computed((): Record => {
  return scoreStore.recordTime;
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
    :recordTime="recordTime"
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
