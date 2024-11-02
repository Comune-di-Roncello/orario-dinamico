<script setup lang="ts">
import OpenBlock from '@/components/OpeningBlock.vue'
import { calendarManager } from '@/stores/calendarmanager'
import { storeToRefs } from 'pinia'
import { onMounted, onBeforeUnmount } from 'vue'

const store = calendarManager()
const { today, later, nextRefreshMillis } = storeToRefs(store)

let screenTimeoutId: NodeJS.Timeout
let jsonTimeoutId: NodeJS.Timeout

function refreshDataOnScreen() {
  console.log('refresh!')
  store.refreshData()
  screenTimeoutId = setTimeout(refreshDataOnScreen, nextRefreshMillis.value)
}

function refreshJsonData() {
  console.log('refresh json')
  store.getJson().then(() => {
    clearInterval(screenTimeoutId)
    refreshDataOnScreen()
  })
  jsonTimeoutId = setTimeout(refreshJsonData, 5000)
}

onMounted(() => {
  refreshJsonData()
  refreshDataOnScreen()
})

onBeforeUnmount(() => {
  clearInterval(screenTimeoutId)
  clearInterval(jsonTimeoutId)
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
