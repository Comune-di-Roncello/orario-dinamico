<script setup lang="ts">
import { defineProps } from 'vue'
import OpenOffice from '@/components/TimetableBlock.vue'
import { type OnScreenEvent } from '@/stores/calendarmanager'

const props = defineProps<{
  outlookevent: Record<string, OnScreenEvent>
}>()
</script>

<template>
  <div class="container pt-4 px-4">
    <h1 class="display-1 d-flex py-3">
      <strong>
        <slot name="open"></slot>
      </strong>
    </h1>
    <div class="container">
      <template v-for="[key, value] of Object.entries(props.outlookevent)" v-bind:key="key">
        <OpenOffice :outlookevent="value"></OpenOffice>
      </template>
    </div>
  </div>
  <!-- <div class="container pt-4 px-4" v-else>
    <h1 class="display-1 d-flex py-3" style="text-align: center">
      <strong><slot name="closed"></slot></strong>
    </h1>
    <hr />
  </div> -->
</template>
