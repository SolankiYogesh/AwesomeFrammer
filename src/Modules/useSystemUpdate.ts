import {useEffect, useState} from 'react'
import {NativeEventEmitter, NativeModules} from 'react-native'

import {Constants, Storage} from '@/Theme'

interface SystemInfoType {
  versionName: string
  systemUpTime: number
  versionCode: number
  ANDROID_ID: string
  systemVersion: string
  isTablet: boolean
}
const {AutoSystemUpdate} = NativeModules

export const SystemInfo: SystemInfoType = {
  versionCode: AutoSystemUpdate?.versionCode as number,
  versionName: AutoSystemUpdate?.versionName as string,
  systemUpTime: AutoSystemUpdate?.systemUpTime as number,
  ANDROID_ID: AutoSystemUpdate?.ANDROID_ID as string,
  isTablet: AutoSystemUpdate.isTablet as boolean,
  systemVersion: AutoSystemUpdate.systemVersion as string
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default (onError?: () => {}, onSuccess?: () => {}) => {
  const [progress, setProgress] = useState<number>(0)
  const [isBufferring, setIsBuffering] = useState(false)

  const checkForUpdate = (): Promise<boolean> => {
    return new Promise<boolean>(async (resolve) => {
      const buildCache = Storage.getString(Constants.asyncStorageKeys.app_build)
      if (buildCache) {
        const isUpdate = await AutoSystemUpdate.checkForUpdate(buildCache)
        resolve(isUpdate)
      } else {
        resolve(false)
      }
    })
  }

  const install = (): void => {
    const buildCache = Storage.getString(Constants.asyncStorageKeys.app_build)

    if (buildCache) {
      const json = JSON.parse(buildCache)
      AutoSystemUpdate.install(json?.build_url)
    }
  }

  useEffect(() => {
    const events = new NativeEventEmitter(AutoSystemUpdate)
    const progressEmit = events.addListener('Progress', setProgress)
    const errorEmit = events.addListener('Error', () => {
      if (onError) onError()
    })
    const bufferEmit = events.addListener('Connecting', (data: number) => {
      switch (data) {
        case 1:
          setIsBuffering(true)
          break
        case 2:
        case 3:
          setIsBuffering(false)
          break
        default:
          setIsBuffering(false)
          break
      }
    })
    const succesEmit = events.addListener('Success', () => {
      if (onSuccess) onSuccess()
    })
    return () => {
      if (progressEmit.remove) {
        progressEmit.remove()
      }
      if (errorEmit.remove) {
        errorEmit.remove()
      }
      if (succesEmit.remove) {
        succesEmit.remove()
      }
      if (bufferEmit.remove) {
        bufferEmit.remove()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    progress,
    install,
    checkForUpdate,
    isBufferring
  }
}
