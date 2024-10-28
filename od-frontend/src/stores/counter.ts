import { defineStore } from 'pinia'
import { type ButtonVariant } from 'bootstrap-vue-next'

export interface OutputEvent {
  name: string
  text: string
  status: ButtonVariant | null
}

export const openOffices = defineStore('openOffices', {
  state: () => ({
    openNow: [] as OutputEvent[],
  }),
  actions: {
    getJson() {
      const url = '/src/assets/open-offices.json'

      fetch(url)
        .then(response => response.json())
        .then(data => (this.openNow = data as OutputEvent[]))
        .catch(error => console.log(error))
    },
  },
})
