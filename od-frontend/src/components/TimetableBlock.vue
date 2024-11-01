<script setup lang="ts">
import { BButton, type ButtonVariant } from 'bootstrap-vue-next'
import { type OutlookEvent } from '@/components/OpeningBlock.vue'
import { onBeforeUnmount, onBeforeMount } from 'vue'
import { DateTime } from 'luxon'
import { ref } from 'vue'

interface OnScreenEvent {
  id: string
  name: string
  text: string
  buttontype: ButtonVariant | null
  hidden: boolean
}

const props = defineProps<{
  outlookevent: OutlookEvent
}>()

const ose = ref({
  name: props.outlookevent.name,
  text: '',
  buttontype: 'info',
  hidden: false,
} as OnScreenEvent)

let intervalId: NodeJS.Timeout

function updateOSE() {
  const now = DateTime.now()
  const thisevent = props.outlookevent

  if (thisevent.begin > thisevent.end.endOf('day')) {
    ose.value.text = thisevent.begin.setLocale('it-IT').toFormat('ccc d LLL, H:mm')
  } else {
    if (thisevent.end.plus({ minutes: 10 }) < now) {
      //Already over by over 10 min
      ose.value.hidden = true
    } else if (thisevent.end < now) {
      //Over
      ose.value.buttontype = 'danger'
      ose.value.text = 'Chiuso'
    } else if (thisevent.end.minus({ minutes: 15 }) < now) {
      // About to end
      ose.value.buttontype = 'warning'
      ose.value.text =
        'Chiude tra ' + thisevent.end.diff(now).toFormat('m') + ' minuti'
    } else if (thisevent.begin < now) {
      //open
      ose.value.buttontype = 'success'
      ose.value.text = 'Aperto fino alle ' + thisevent.end.toFormat('H:mm')
    } else if (thisevent.begin.minus({ minutes: 15 }) < now) {
      // Hasn't started yet
      ose.value.buttontype = 'primary'
      ose.value.text =
        'Apre tra ' + thisevent.begin.diff(now).toFormat('m:ss') + ' minuti'
      intervalId = setTimeout(() => updateOSE(), 1000)
    } else {
      ose.value.buttontype = 'info'
      ose.value.text = 'Apre alle ' + thisevent.begin.toFormat('H:mm')
    }
  }
}

onBeforeMount(() => {
  updateOSE()
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div class="row py-2 align-items-center">
    <div class="col-7">
      <h1 class="display-3">{{ ose.name }}</h1>
    </div>
    <div class="col-5">
      <BButton :variant="ose.buttontype"
        ><h1>{{ ose.text }}</h1></BButton
      >
    </div>
  </div>
</template>
