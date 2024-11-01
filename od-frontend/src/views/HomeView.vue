<script setup lang="ts">
import OpenBlock from '@/components/OpeningBlock.vue'
import { calendarManager } from '@/stores/calendarmanager';
import { onMounted } from 'vue';

const store = calendarManager()

onMounted(() => {
  store.getJson()
})

</script>

<template>
  <main>
    <OpenBlock :outlookevent="store.today">Uffici ora aperti al pubblico</OpenBlock>
    <OpenBlock :outlookevent="store.later">Prossime aperture</OpenBlock>
  </main>
</template>
