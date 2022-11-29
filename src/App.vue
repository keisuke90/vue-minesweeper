<script setup lang="ts">
import { ref } from "vue";
import MsGame from "./components/MsGame.vue";
import ScoreModal from "./components/ScoreModal.vue";

let modalVisible = ref(false);
const showModal = (): void => {
  modalVisible.value = true;
};
const closeModal = (): void => {
  modalVisible.value = false;
};
</script>

<template>
  <h1 class="title">Vue-Minesweeper</h1>
  <div class="content">
    <MsGame />
  </div>
  <button @click="showModal()">score</button>
  <score-modal :isVisible="modalVisible" @close="closeModal"></score-modal>
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
