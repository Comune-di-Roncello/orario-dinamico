import { defineStore } from 'pinia'
import { type ButtonVariant } from 'bootstrap-vue-next'
import { DateTime } from 'luxon'

export interface OutputEvent {
  name: string
  text: string
  status: ButtonVariant | null
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

export const openOffices = defineStore('openOffices', {
  state: () => ({
    today: [] as OutputEvent[],
    later: [] as OutputEvent[],
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
      const now = DateTime.now()
      let status = 'info'
      let text = ''

      if (begin > now.endOf('day')) {
        text = begin.setLocale('it-IT').toFormat('ccc d LLL, H:mm')
      } else {
        if (end.plus({ minutes: 10 }) < now) {
          //Already over by over 10 min
          return null
        } else if (end < now) {
          //Over
          status = 'danger'
          text = 'Chiuso'
        } else if (end.minus({ minutes: 15 }) < now) {
          // About to end
          status = 'warning'
          text = 'Chiude tra ' + end.diff(now).toFormat('m') + ' minuti'
        } else if (begin < now) {
          //open
          status = 'success'
          text = 'Aperto fino alle ' + end.toFormat('H:mm')
        } else if (begin.minus({ minutes: 15 }) < now) {
          // Hasn't started yet
          status = 'primary'
          text = 'Apre tra ' + begin.diff(now).toFormat('m:ss') + ' minuti'
        } else {
          status = 'info'
          text = 'Apre alle ' + begin.toFormat('H:mm')
        }
      }

      return {
        name: event.subject,
        text: text,
        status: status,
      } as OutputEvent
    },
  },
})
