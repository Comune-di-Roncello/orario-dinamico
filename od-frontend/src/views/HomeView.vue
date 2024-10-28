<script setup lang="ts">
import OpenBlock from '@/components/OpeningBlock.vue';
import { openOffices } from '@/stores/counter';
import { onBeforeUnmount, onMounted } from 'vue';

const store = openOffices()

let intervalId: NodeJS.Timeout;

function getNewJson() {
  intervalId = setTimeout(() => getNewJson(), 2000)
  store.getJson()
  return intervalId
}

onMounted(() => {
  intervalId = getNewJson()
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
})
</script>

<template>
  <main>
    <OpenBlock :slots=store.openNow>Uffici ora aperti al pubblico</OpenBlock>
    <OpenBlock :slots=store.later>Prossime aperture</OpenBlock>
  </main>
</template>
