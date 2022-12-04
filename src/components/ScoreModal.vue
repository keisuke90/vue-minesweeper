<script setup lang="ts">
import type { Score } from "@/stores/score";

interface Props {
  isVisible: boolean;
  isLoading: boolean;
  time: number;
  isWin: boolean;
  scoreList: Map<number, Score>;
}
interface Emits {
  (event: "close"): void;
}
defineProps<Props>();
const emit = defineEmits<Emits>();
const close = (): void => {
  emit("close");
};
</script>

<template>
  <teleport to="body">
    <div
      class="modal"
      id="sample-modal"
      v-show="isVisible"
      @click="close"
    ></div>
    <div class="modal-content" v-show="isVisible">
      <p v-if="isLoading">データ取得中...</p>
      <p v-if="isWin">クリアタイム：{{ time }}</p>
      <div class="score-table">
        <tr class="score-header">
          <th>No</th>
          <th>レベル</th>
          <th>タイム</th>
          <th>日</th>
        </tr>
        <template v-for="(score, id) in scoreList" :key="id">
          <tr class="score-data">
            <td>{{ id + 1 }}</td>
            <td>{{ score[1].level }}</td>
            <td>{{ score[1].time }}</td>
            <td>{{ score[1].date }}</td>
          </tr>
        </template>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.modal-content {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: white;
  width: 600px;
  height: auto;
  border-radius: 20px;
  padding: 20px;
}

.score-table {
  width: 70%;
}
.score-header {
  display: flex;
  justify-content: space-between;
}
.score-data {
  display: flex;
  justify-content: space-between;
}
</style>
