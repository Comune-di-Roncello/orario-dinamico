<script setup lang="ts">
import { BButton, type ButtonVariant } from 'bootstrap-vue-next';

defineProps<{
  buttonvariant?: (ButtonVariant) | null,
  ufficio?: string
}>()

</script>

<template>
  <div class="row py-2 align-items-center">
    <div class="col-7">
      <h1 class="display-3">{{ ufficio }}</h1>
    </div>
    <div class="col-5">
      <BButton :variant="buttonvariant"><h1><slot></slot></h1></BButton>
    </div>
  </div>
</template>
