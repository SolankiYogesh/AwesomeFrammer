import {RouteProp, useRoute as useMyRoute} from '@react-navigation/native'

function useRoute<T extends keyof RootStackParamList>(): RouteProp<RootStackParamList, T> {
  return useMyRoute<RootRouteProps<T>>()
}

export default useRoute
