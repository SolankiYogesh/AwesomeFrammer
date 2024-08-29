import moment, {Moment} from 'moment'

import {Emitter, Storage} from '@/Theme'
import constants from '@/Theme/Constants'

export default class TimeHandler {
  static startTimeOutID: NodeJS.Timeout | null = null
  static endTimeOutID: NodeJS.Timeout | null = null
  static awakeTimeOutID: NodeJS.Timeout | null = null
  static isSleepScreen = false

  static time: Moment | null = null

  static start = () => {
    if (this.startTimeOutID) {
      clearTimeout(this.startTimeOutID)
    }
    if (this.endTimeOutID) {
      clearTimeout(this.endTimeOutID)
    }
    this.isSleepScreen = false
    const startTime = Storage.getNumber(constants.timerObject.START)

    if (startTime) {
      const startDuration = moment.unix(startTime).diff(moment(), 'milliseconds')

      this.startTimeOutID = setTimeout(() => {
        this.isSleepScreen = true
        Emitter.emit('onSleep')
        if (this.startTimeOutID) {
          clearTimeout(this.startTimeOutID)
        }
        Storage.set(constants.timerObject.START, moment.unix(startTime).add(1, 'day').unix())
        const endTime = Storage.getNumber(constants.timerObject.END)
        if (endTime) {
          const endDuration = moment.unix(endTime).diff(moment(), 'milliseconds')

          this.endTimeOutID = setTimeout(() => {
            this.isSleepScreen = false
            Emitter.emit('onSleepEnd')

            if (this.endTimeOutID) {
              clearTimeout(this.endTimeOutID)
            }
            Storage.set(constants.timerObject.END, moment.unix(endTime).add(1, 'day').unix())
            this.start()
          }, endDuration)
        }
      }, startDuration)
    }
  }

  static initializeTimer = () => {
    let startTime = Storage.getNumber(constants.timerObject.START)
    if (!startTime) {
      const startOfDay = moment('22:00', 'HH:mm')
      Storage.set(constants.timerObject.START, startOfDay.unix())
      startTime = startOfDay.unix()
    }
    let endTime = Storage.getNumber(constants.timerObject.END)
    if (!endTime) {
      const endOfDay = moment('09:00', 'HH:mm')
      Storage.set(constants.timerObject.END, endOfDay.unix())
      endTime = endOfDay.unix()
    }
    let awakeTime = Storage.getNumber(constants.timerObject.AWAKE)

    if (!awakeTime) {
      Storage.set(constants.timerObject.AWAKE, 10)

      awakeTime = 10
    }
    return {
      start: startTime,
      end: endTime,
      awake: awakeTime
    }
  }

  static stop = () => {
    if (this.startTimeOutID) {
      clearTimeout(this.startTimeOutID)
    }
    if (this.endTimeOutID) {
      clearTimeout(this.endTimeOutID)
    }
  }

  static startAwakeTimer = () => {
    if (this.awakeTimeOutID) {
      clearTimeout(this.awakeTimeOutID)
    }
    Emitter.emit('onSleepEnd')
    const awakeTime = Storage.getNumber(constants.timerObject.AWAKE)
    if (awakeTime) {
      this.awakeTimeOutID = setTimeout(
        () => {
          if (this.isSleepScreen) {
            Emitter.emit('onSleep')
          }
        },
        awakeTime * 60 * 1000
      )
    }
  }
}
