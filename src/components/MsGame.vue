<script setup lang="ts">
import MsField from "./MsField.vue";
import MsStatusBar from "./MsStatusBar.vue";
</script>

<template>
  <div class="game">
    <MsStatusBar />
    <MsField />
  </div>
</template>

<style scoped>
.game {
  user-select: none;
  width: fit-content;
}
</style>
