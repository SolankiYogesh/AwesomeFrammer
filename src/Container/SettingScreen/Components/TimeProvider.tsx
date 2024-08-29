import React, {createContext, useCallback, useContext, useState} from 'react'
import {cloneDeep} from 'lodash'
import moment from 'moment'

import {Constants, Storage} from '@/Theme'

export const TimeContext = createContext<{
  state: {
    start: {
      hours: string
      minutes: string
      half: string
    }
    end: {
      hours: string
      minutes: string
      half: string
    }
  }
  updateValue: (type: 'start' | 'end', key: 'minutes' | 'hours', value: string) => void
}>({} as any)

const getAMPM = (hours: number) => {
  if (hours >= 0 && hours < 12) {
    return 'AM'
  } else {
    return 'PM'
  }
}

export default ({children}: {children: React.ReactNode}) => {
  const start = Storage.getNumber(Constants.timerObject.START)
  const startHours = start
    ? {
        hours: moment
          .unix(start)
          .get('hours')
          .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false}),
        minutes: moment
          .unix(start)
          .get('minutes')
          .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false}),
        half: moment.unix(start).format('A')
      }
    : {
        hours: '00',
        minutes: '00',
        half: 'AM'
      }

  const end = Storage.getNumber(Constants.timerObject.END)
  const endHours = end
    ? {
        hours: moment
          .unix(end)
          .get('hours')
          .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false}),
        minutes: moment
          .unix(end)
          .get('minutes')
          .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false}),
        half: moment.unix(end).format('A')
      }
    : {
        hours: '00',
        minutes: '00',
        half: 'AM'
      }

  const [startTime, setStartTime] = useState(startHours)
  const [endTime, setEndTime] = useState(endHours)

  const updateValue = useCallback(
    (type: 'start' | 'end', key: 'minutes' | 'hours', value: string) => {
      if (type === 'start') {
        setStartTime((state) => {
          const clone = cloneDeep(state)
          if (key === 'hours') {
            clone.half = getAMPM(Number(value))
          }
          return {
            ...clone,
            [key]: value
          }
        })
      } else {
        setEndTime((state) => {
          const clone = cloneDeep(state)
          if (key === 'hours') {
            clone.half = getAMPM(Number(value))
          }
          return {
            ...clone,
            [key]: value
          }
        })
      }
    },
    []
  )

  return (
    <TimeContext.Provider
      value={{
        updateValue,
        state: {
          start: startTime,
          end: endTime
        }
      }}
    >
      {children}
    </TimeContext.Provider>
  )
}
export const useSettingTime = (type: 'start' | 'end') => {
  const {updateValue, state} = useContext(TimeContext)
  return {
    updateValue,
    ...state[type]
  }
}
