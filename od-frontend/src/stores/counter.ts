import { defineStore } from 'pinia'
import { type ButtonVariant } from 'bootstrap-vue-next'

export interface OutputEvent {
  name: string
  text: string
  status: ButtonVariant | null
}

export class Event {
  id!: string
  createdDateTime!: string
  lastModifiedDateTime!: string
  originalStartTimeZone!: string
  originalEndTimeZone!: string
  subject!: string
  bodyPreview!: string
  isCancelled!: boolean
  showAs!: string
  type!: string
  occurrenceId!: string
  body!: Body
  start: number
  end: number
  recurrence!: string
  attendees!: Array<string>

  constructor(start: string, end: string) {
    this.start = Date.parse(start)
    this.end = Date.parse(end)
  }
}

export const openOffices = defineStore('openOffices', {
  state: () => ({
    today: [] as OutputEvent[],
    later: [] as OutputEvent[]
  }),
  actions: {
    getJson() {
      const url = '/src/assets/open-offices.json'

      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.today = []
          data.today.forEach((element: Event) => {
            this.today.push(this.calculateEvent(element))
          });

          this.later = []
          data.later.forEach((element: Event) => {
            this.later.push(this.calculateEvent(element))
          });

        })
        .catch(error => {
          console.log(error)
          return
        })

    },
    calculateEvent(event: Event){
      return {
        name: "antani",
        text: "scappellamento",
        status: "success"

      } as OutputEvent

    }
  },
})
