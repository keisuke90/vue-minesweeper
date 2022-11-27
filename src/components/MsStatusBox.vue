<script setup lang="ts"></script>

<template>
  <div class="box">
    <slot />
  </div>
</template>

<style scoped>
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100px;
  border: 1px black solid;
}
</style>
