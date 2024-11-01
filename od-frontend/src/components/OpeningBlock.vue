<script setup lang="ts">
import { defineProps } from 'vue'
import OpenOffice from '@/components/TimetableBlock.vue'
import { type OutlookEvent } from '@/stores/calendarmanager'

const props = defineProps<{
  outlookevent: Array<OutlookEvent>
}>()
</script>

<template>
  <div class="container pt-4 px-4" v-if="outlookevent.length > 0">
    <h1 class="display-1 d-flex py-3">
      <strong>
        <slot name="open"></slot>
      </strong>
    </h1>
    <div class="container">
      <template v-for="item in props.outlookevent" v-bind:key="item.ufficio">
        <OpenOffice :outlookevent="item"></OpenOffice>
      </template>
    </div>
  </div>
  <div class="container pt-4 px-4" v-else>
    <h1 class="display-1 d-flex py-3" style="text-align: center">
      <strong><slot name="closed"></slot></strong>
    </h1>
    <hr />
  </div>
</template>
