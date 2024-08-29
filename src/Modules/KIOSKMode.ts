import {NativeModules} from 'react-native'

const KIOSK = NativeModules.KIOSKModule

export default KIOSK as {
  init: () => void
  remove: () => void
  isAdmin: () => boolean
}
