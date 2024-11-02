<script setup lang="ts">
import { BButton } from 'bootstrap-vue-next'
import { type OnScreenEvent } from '@/stores/calendarmanager'

const props = defineProps<{
  outlookevent: OnScreenEvent
}>()
</script>

<template>
  <div class="row py-2 align-items-center">
    <div class="col-7">
      <h1 class="display-3">{{ props.outlookevent.name }}</h1>
    </div>
    <div class="col-5">
      <BButton :variant="props.outlookevent.buttontype"
        ><h1>{{ props.outlookevent.text }}</h1></BButton
      >
    </div>
  </div>
</template>
