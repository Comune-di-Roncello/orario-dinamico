<script setup lang="ts">
import OpenBlock from '@/components/OpeningBlock.vue'
import { calendarManager } from '@/stores/calendarmanager'
import { storeToRefs } from 'pinia'
import { onMounted, onBeforeUnmount } from 'vue'

const store = calendarManager()
const { today, later, nextRefreshMillis } = storeToRefs(store)

let timeoutId: NodeJS.Timeout

function refreshjson() {
  console.log('refresh!')
  store.getJson().then(() => {
    setTimeout(refreshjson, nextRefreshMillis.value)
  })
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
    <OpenBlock :outlookevent="today">
      <template v-slot:open>Uffici oggi aperti al pubblico</template>
      <template v-slot:closed
        >Tutti gli uffici sono chiusi al pubblico</template
      >
    </OpenBlock>
    <OpenBlock :outlookevent="later">
      <template v-slot:open>Prossime aperture</template>
      <template v-slot:closed>Dati temporaneamente non disponibili</template>
    </OpenBlock>
  </main>
</template>
