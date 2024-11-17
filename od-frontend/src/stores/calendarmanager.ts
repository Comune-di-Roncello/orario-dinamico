import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { type ButtonVariant } from 'bootstrap-vue-next'

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

export interface OnScreenEvent {
  name: string
  text: string
  buttontype: ButtonVariant | null
}

const hide_after_min = 10
const warn_before_min = 15
const countdown_to_open_min = 10

export const calendarManager = defineStore('openOffices', {
  state: () => ({
    azurejson: {
      today: [] as Array<Event>,
      later: [] as Array<Event>,
    },
    today: {} as Record<string, OnScreenEvent>,
    later: {} as Record<string, OnScreenEvent>,
    nextRefreshMillis: 1000,
  }),
  actions: {
    async getJson() {
      const url = '/src/assets/open-offices.json'

      await fetch(url)
        .then(response => response.json())
        .then(data => (this.azurejson = data))
        .catch(error => {
          console.log(error)
          return
        })
    },
    refreshData() {
      const nextRefreshes = [] as Array<number>
      this.azurejson.today.forEach((element: Event) => {
        const outevent = this.calculateEvent(element)

        if (!outevent) {
          delete this.today[element.id]
        } else {
          this.today[outevent.id] = outevent.event
          nextRefreshes.push(outevent.nextRefresh)
        }
      })

      Object.keys(this.today).forEach(key => {
        let found = false
        this.azurejson.today.forEach((element: Event) => {
          if (key == element.id) {
            found = true
          }
        })

        if (!found) {
          delete this.today[key]
        }
      })

      this.azurejson.later.forEach((element: Event) => {
        const outevent = this.calculateEvent(element)

        if (!outevent) {
          delete this.later[element.id]
        } else {
          this.later[outevent.id] = outevent.event
          nextRefreshes.push(outevent.nextRefresh)
        }
      })
      console.log(nextRefreshes)

      Object.keys(this.later).forEach(key => {
        let found = false
        this.azurejson.later.forEach((element: Event) => {
          if (key == element.id) {
            found = true
          }
        })

        if (!found) {
          delete this.later[key]
        }
      })

      this.nextRefreshMillis = Math.min(...nextRefreshes)
    },
    calculateEvent(event: Event) {
      const begin = DateTime.fromISO(event.start, { zone: 'UTC' }).setZone(
        'Europe/Rome',
      )
      const end = DateTime.fromISO(event.end, { zone: 'UTC' }).setZone(
        'Europe/Rome',
      )
      const now = DateTime.now()

      if (DateTime.now().diff(end, ['minutes']).minutes >= 10) {
        return
      }

      const ose = {
        name: event.subject,
        text: '',
        buttontype: 'info',
      } as OnScreenEvent
      let millis = 1000

      if (begin > end.endOf('day')) {
        ose.text = begin.setLocale('it-IT').toFormat('ccc d LLL, H:mm')
        millis = now.endOf('day').diff(now, ['milliseconds']).milliseconds
      } else {
        if (end.plus({ minutes: hide_after_min }) < now) {
          //Already over by over 10 min
          return
        }
        if (end < now) {
          //Over
          ose.buttontype = 'danger'
          ose.text = 'Chiuso'

          //Callback to 10 min after close
          millis = end
            .plus({ minutes: hide_after_min, seconds: 10 })
            .diff(now).milliseconds
        } else if (end.minus({ minutes: warn_before_min }) < now) {
          // About to end
          const minutes_left = Math.floor(end.diff(now, ['minutes']).minutes)

          if (minutes_left < 5) {
            ose.buttontype = 'danger'
          } else {
            ose.buttontype = 'warning'
          }

          if (minutes_left == 0) {
            ose.text = 'Chiude tra < 1 minuto'
          } else {
            ose.text = `Chiude tra ${minutes_left} minuti`
          }

          // Callback at :00 of the next minute
          millis = now.endOf('minute').diff(now).milliseconds
        } else if (begin < now) {
          //open
          ose.buttontype = 'success'
          ose.text = 'Aperto fino alle ' + end.toFormat('H:mm')

          // Callback at 14 minutes and 50 seconds before end
          millis = end
            .minus({ minutes: warn_before_min })
            .plus({ seconds: 5 })
            .diff(now).milliseconds
        } else if (begin.minus({ minutes: countdown_to_open_min }) < now) {
          // Hasn't started yet
          ose.buttontype = 'primary'
          ose.text = 'Apre tra ' + begin.diff(now).toFormat('m:ss') + ' minuti'

          // Callback in 1 second
          millis = now.endOf('second').diff(now, ['milliseconds']).milliseconds
        } else {
          ose.buttontype = 'info'
          if (begin < now.endOf('day')) {
            ose.text = 'Apre alle ' + begin.toFormat('H:mm')
          } else if (begin < now.endOf('day').plus({ hours: 24 })) {
            ose.text = 'Apre domani alle ' + begin.toFormat('H:mm')
          } else {
            ose.text = `Apre ${begin.setLocale('it-it').toFormat('cccc d')} alle ${begin.toFormat('H:mm')}`
          }

          // Callback to countdown_to_open min
          millis = begin
            .minus({ minutes: countdown_to_open_min })
            .plus({ seconds: 5 })
            .diff(now).milliseconds
        }
      }

      return {
        id: event.id,
        nextRefresh: millis,
        event: ose,
      }
    },
  },
})
