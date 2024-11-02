<script setup lang="ts">
import OpenBlock from '@/components/OpeningBlock.vue'
import { calendarManager } from '@/stores/calendarmanager'
import { onMounted, onBeforeUnmount } from 'vue'

const store = calendarManager()
let timeoutId: NodeJS.Timeout

function refreshjson(){
  store.getJson()
  timeoutId = setTimeout(refreshjson, store.nextRefreshMillis)
  console.log('Set timeout for %d millis', store.nextRefreshMillis)

}

onMounted(() => {
  refreshjson()
})

onBeforeUnmount(() => {
  clearInterval(timeoutId)
})
</script>

<template>
  <main>
    <OpenBlock :outlookevent="store.today">
      <template v-slot:open>Uffici oggi aperti al pubblico</template>
      <template v-slot:closed
        >Tutti gli uffici sono chiusi al pubblico</template
      >
    </OpenBlock>
    <OpenBlock :outlookevent="store.later">
      <template v-slot:open>Prossime aperture</template>
      <template v-slot:closed>Dati temporaneamente non disponibili</template>
    </OpenBlock>
  </main>
</template>
