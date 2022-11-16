<script setup lang="ts">
import { ref } from "vue";
import MsCell from "./MsCell.vue";

const row = 9;
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let isOpen = ref(true);
</script>

<template>
  <div class="field">
    <div v-for="cell in rows">
      <MsCell v-for="cell in rows" :open="isOpen"><span>1</span></MsCell>
    </div>
  </div>
</template>

<style scoped>
.field {
  height: 100%;
  width: 100%;
  background-color: green;
}
</style>
