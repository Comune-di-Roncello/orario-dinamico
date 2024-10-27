<script setup lang="ts">
import { RouterView } from 'vue-router'
import 'typeface-titillium-web';
import 'typeface-roboto-mono';
import 'typeface-lora';
import 'bootstrap-italia/dist/css/bootstrap-italia.min.css';
</script>

<template>
  <div class="header bluitalia">
    <header class="d-flex justify-content-center py-3">
      <img src="@/assets/logo.svg" class="stemma align-middle" />
      <h1 class="my-auto px-3 align-middle display-2 fw-bolder">Comune di Roncello</h1>
    </header>
  </div>

  <RouterView />
</template>

<style scoped>
.bluitalia {
  background-color: #0060df;
  color: white;
}

.stemma {
  height: 150px;
}

.header{
    width: 100%;
}

</style>
