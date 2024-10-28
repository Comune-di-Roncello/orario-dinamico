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

export interface OutlookEvents {
  today: Array<Event>
  later: Array<Event>
}

export const openOffices = defineStore('openOffices', {
  state: () => ({
    today: [] as Event[],
    later: [] as Event[]
  }),
  actions: {
    getJson() {
      const url = '/src/assets/open-offices.json'

      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.today = []
          data.today.forEach((element: Event) => {
            this.today.push(element)
          });

          this.later = []
          data.later.forEach((element: Event) => {
            this.later.push(element)
          });

        })
        .catch(error => {
          console.log(error)
          return
        })

    },
  },
})
