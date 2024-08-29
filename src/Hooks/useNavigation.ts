import {useNavigation as useNative} from '@react-navigation/native'
import {type NativeStackNavigationProp} from '@react-navigation/native-stack'

function useNavigation() {
  return useNative<NativeStackNavigationProp<RootStackParamList>>()
}
export default useNavigation
