<script setup lang="ts">
import { defineProps } from 'vue'
import OpenOffice from '@/components/TimetableBlock.vue'
import { type OutlookEvent } from '@/views/HomeView.vue'

const props = defineProps<{
  outlookevent: Array<OutlookEvent>
}>()
</script>

<template>
  <div class="container pt-4 px-4">
    <h1 class="display-1 d-flex py-3">
      <strong>
        <slot></slot>
      </strong>
    </h1>
    <div class="container">
      <template v-for="item in props.outlookevent" v-bind:key="item.ufficio">
        <OpenOffice :outlookevent="item"></OpenOffice>
      </template>
    </div>
  </div>
</template>
