<script setup lang="ts">
import MsField from "./MsField.vue";
import MsStatus from "./MsStatus.vue";
</script>

<template>
  <div class="game">
    <MsStatus />
    <MsField />
  </div>
</template>

<style scoped>
.game {
  user-select: none;
}
</style>
