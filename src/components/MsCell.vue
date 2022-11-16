<script setup lang="ts">
import type { slotFlagsText } from "@vue/shared";

interface Props {
  open: boolean;
}
defineProps<Props>();
</script>

<template>
  <div class="cell" :class="{ open: open }"><slot /></div>
</template>

<style scoped>
.cell {
  display: inline-block;
  height: 30px;
  width: 30px;
  border: 1px solid white;
  background-color: black;
}

.cell.open {
  background-color: red;
}
</style>
