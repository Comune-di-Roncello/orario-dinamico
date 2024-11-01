import { defineStore } from 'pinia'
import { DateTime } from 'luxon'

export interface OutlookEvent {
  id: string
  name: string
  begin: DateTime
  end: DateTime
}

export interface Event {
  id: string
  createdDateTime: string
  lastModifiedDateTime: string
  originalStartTimeZone: string
  originalEndTimeZone: string
  subject: string
  bodyPreview: string
  isCancelled: boolean
  showAs: string
  type: string
  occurrenceId: string
  body: Body
  start: string
  end: string
  recurrence: string
  attendees: Array<string>
}

export const calendarManager = defineStore('openOffices', {
  state: () => ({
    today: [] as OutlookEvent[],
    later: [] as OutlookEvent[],
  }),
  actions: {
    getJson() {
      const url = '/src/assets/open-offices.json'

      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.today = []
          data.today.forEach((element: Event) => {
            const outevent = this.calculateEvent(element)
            if (outevent != null) {
              this.today.push(outevent)
            }
          })

          this.later = []
          data.later.forEach((element: Event) => {
            const outevent = this.calculateEvent(element)
            if (outevent != null) {
              this.later.push(outevent)
            }
          })
        })
        .catch(error => {
          console.log(error)
          return
        })
    },
    calculateEvent(event: Event) {
      const begin = DateTime.fromISO(event.start, { zone: 'UTC' }).setZone(
        'Europe/Rome',
      )
      const end = DateTime.fromISO(event.end, { zone: 'UTC' }).setZone(
        'Europe/Rome',
      )

      return {
        id: event.id,
        name: event.subject,
        begin: begin,
        end: end
      } as OutlookEvent
    },
  },
})
