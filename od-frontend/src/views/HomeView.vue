<script setup lang="ts">
import OpenBlock from '@/components/OpeningBlock.vue'
import { calendarManager } from '@/stores/calendarmanager'
import { onMounted, onBeforeUnmount, computed } from 'vue'

const store = calendarManager()

let screenTimeoutId: NodeJS.Timeout
let jsonTimeoutId: NodeJS.Timeout

const today = computed({
  get() {
    const out = []
    for (const x of Object.entries(store.today)) {
      out.push(x[1])
    }

    return out.sort((a, b) => a.startDate.diff(b.startDate, ['seconds']).seconds)
  },
  set() { }
})

const later = computed({
  get() {
    const out = []
    for (const x of Object.entries(store.later)) {
      out.push(x[1])
    }

    return out.sort((a, b) => a.startDate.diff(b.startDate, ['seconds']).seconds)
  },
  set() { }
})

const nextRefreshMillis = computed({
  get() { return store.nextRefreshMillis },
  set() { }
})


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
  jsonTimeoutId = setTimeout(refreshJsonData, 20 * 60 * 1000)
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
      <template v-slot:closed>Tutti gli uffici sono chiusi al pubblico</template>
    </OpenBlock>
    <OpenBlock :outlookevent="later">
      <template v-slot:open>Prossime aperture</template>
      <template v-slot:closed>Dati temporaneamente non disponibili</template>
    </OpenBlock>
  </main>
</template>
