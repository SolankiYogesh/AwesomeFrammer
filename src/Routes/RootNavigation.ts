import {createNavigationContainerRef} from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export function navigate(...arg: never) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(arg)
  }
}
