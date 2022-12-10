<script setup lang="ts">
interface Props {
  title: string;
}
defineProps<Props>();
</script>

<template>
  <div class="box">
    <span class="title">{{ title }}</span>
    <slot />
  </div>
</template>

<style scoped>
.box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100px;
  border: 1px black solid;
}
.title {
  position: absolute;
  font-size: 1px;
  top: 0;
  left: 2%;
}
</style>
