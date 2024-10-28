<script setup lang="ts">
import OpenOffice from '@/components/TimetableBlock.vue'
import { type Event } from '@/stores/counter';

defineProps({
  slots: Array<Event>,
})

</script>

<template>
  <div class="container pt-4 px-4">
    <h1 class="display-1 d-flex py-3">
      <strong>
        <slot></slot>
      </strong>
    </h1>
    <div class="container">
      <template v-for="item in slots" v-bind:key="item.ufficio">
        <OpenOffice :buttonvariant=item.type :ufficio=item.subject>
          {{ item.subject }}
        </OpenOffice>
      </template>
    </div>
  </div>
</template>
