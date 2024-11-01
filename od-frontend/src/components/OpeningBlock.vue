<script setup lang="ts">
import OpenOffice from '@/components/TimetableBlock.vue'
import { type OutputEvent } from '@/stores/calendarmanager';
import { DateTime } from 'luxon';

defineProps({
  slots: Array<OutputEvent>,
})

export interface OutlookEvent {
  id: string
  name: string
  text: string
  begin: DateTime,
  end: DateTime
}

const ose = {
  id: "fdsfdsafdas",
  name: "antani",
  text: "cacca",
  begin: DateTime.fromISO('2024-11-01T16:00:50', {zone: 'UTC'}).setZone('CET'),
  end: DateTime.fromISO('2024-11-01T18:00:00', {zone: 'UTC'}).setZone('CET')
} as OutlookEvent


</script>

<template>
  <div class="container pt-4 px-4">
    <h1 class="display-1 d-flex py-3">
      <strong>
        <slot></slot>
      </strong>
    </h1>
    <div class="container">
      <OpenOffice :outlookevent="ose"></OpenOffice>
      <!-- <template v-for="item in slots" v-bind:key="item.ufficio">
      </template> -->
    </div>
  </div>
</template>
