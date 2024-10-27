<script setup lang="ts">
import OpenOffice from '@/components/OpenOffice.vue'
import { openOffices } from '@/stores/counter';
import { setInterval } from 'timers/promises';
import { onBeforeUnmount, onMounted } from 'vue';

const store = openOffices()

let intervalId;
function getNewJson() {
  intervalId = setTimeout(() => getNewJson(), 2000)
  return store.getJson()
}

onMounted(() => {
  intervalId = setTimeout(() => getNewJson(), 2000)
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
})

</script>

<template>
  <div class="container pt-4 px-4">
    <h1 class="display-1 d-flex py-3">
      <strong>Uffici ora aperti al pubblico:</strong>
    </h1>
    <div class="container">
      <template v-for="item in store.openNow" v-bind:key="item.ufficio">
        <OpenOffice :buttonvariant="item.colore" :ufficio=item.ufficio>
          {{ item.stato }}
        </OpenOffice>
      </template>
    </div>
  </div>
</template>
