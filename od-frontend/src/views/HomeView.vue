<script setup lang="ts">
import OpenBlock from '@/components/OpeningBlock.vue'
import { DateTime } from 'luxon'

export interface OutlookEvent {
  id: string
  name: string
  begin: DateTime
  end: DateTime
}

const store = {
  today: [
    {
      id: 'fdsfdsafdas',
      name: 'antani',
      begin: DateTime.fromISO('2024-11-01T19:55:00', { zone: 'UTC' }).setZone(
        'CET',
      ),
      end: DateTime.fromISO('2024-11-01T22:00:00', { zone: 'UTC' }).setZone(
        'CET',
      ),
    } as OutlookEvent,
        {
      id: 'fdsfdsafdas',
      name: 'sblorfz',
      begin: DateTime.fromISO('2024-11-01T19:55:00', { zone: 'UTC' }).setZone(
        'CET',
      ),
      end: DateTime.fromISO('2024-11-01T22:00:00', { zone: 'UTC' }).setZone(
        'CET',
      ),
    } as OutlookEvent,
  ],
  later:  [
    {
      id: 'fdsfdsafdas',
      name: 'antani',
      begin: DateTime.fromISO('2024-11-01T19:55:00', { zone: 'UTC' }).setZone(
        'CET',
      ),
      end: DateTime.fromISO('2024-11-01T22:00:00', { zone: 'UTC' }).setZone(
        'CET',
      ),
    } as OutlookEvent,
  ],
}
</script>

<template>
  <main>
    <OpenBlock :outlookevent="store.today">Uffici ora aperti al pubblico</OpenBlock>
    <OpenBlock :outlookevent="store.later">Prossime aperture</OpenBlock>
  </main>
</template>
