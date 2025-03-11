<template>
  <div class="layout">
    <Topbar></Topbar>
    <Center></Center>
    <!-- <Footer></Footer> -->
  </div>
</template>

<script setup lang="ts">
import Topbar from "../topbar/index.vue";
import Center from "../center/index.vue";
// import Footer from "../footer/index.vue";
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #f8f8f8;
}

.layout::-webkit-scrollbar {
  display: none;
}
</style>
