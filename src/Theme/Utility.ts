import {ToastAndroid} from 'react-native'
import NetInfo from '@react-native-community/netinfo'

import i18n from '@/i18n/i18n'

const wait = async (seconds = 1000): Promise<void> => {
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      resolve()
      clearTimeout(timeout)
    }, seconds)
  })
}

const isInternet = async () => {
  const data = await NetInfo.fetch()
  if (data.isConnected) {
    return data.isConnected
  }
  ToastAndroid.show(i18n.t('S2'), ToastAndroid.SHORT)
  return false
}

const showToast = (message: string) => {
  setTimeout(() => {
    ToastAndroid.show(message, ToastAndroid.LONG)
  }, 500)
}

const navigationOptions = {
  headerShown: false,
  animation: 'slide_from_right'
} as never

const Utility = {
  navigationOptions,
  wait,
  isInternet,
  showToast
}

export default Utility
