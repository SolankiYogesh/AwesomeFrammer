import React, {useEffect, useMemo} from 'react'
import SplashScreen from 'react-native-splash-screen'
import {CommonActions, NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import {
  FrameConnectScreen,
  HomeScreen,
  OnBoardScreen,
  SleepScreen,
  UpdateScreen,
  WifiConnectScreen
} from '../Container'
import GalleryScreen from '../Container/GalleryScreen/GalleryScreen'
import SettingScreen from '../Container/SettingScreen/SettingScreen'
import {Emitter, Screens, Storage} from '../Theme'
import Utility from '../Theme/Utility'
import {navigationRef} from './RootNavigation'
import TimeHandler from '@/Components/TimeHandler'
import {useMedia} from '@/Hooks'
import {SystemInfo} from '@/Modules/useSystemUpdate'
import Constants from '@/Theme/Constants'

const Stack = createNativeStackNavigator()

export default () => {
  const userData = useMemo(() => Storage.getStorageData(Constants.asyncStorageKeys.userData), [])
  const {start} = useMedia()
  useEffect(() => {
    // Storage.set(
    //   Constants.asyncStorageKeys.app_build,
    //   '{"build_url":"https://filetransfer.io/data-package/Z63BkETA/download","force_update":true,"publish_date":1724232585000,"update_info":"NewFeatures:Explorethelatestfunctionalitiesaddedtoenhanceyourexperience.ImprovedPerformance:Enjoyfasterandmoreefficientperformancewiththelatestoptimizations.BugFixes:We\'veresolvedvariousissuestoensureasmootheruserexperience.SecurityEnhancements:Yourdata\'ssecurityisourpriority;enjoyimprovedprotection.","version":"1.0.2"}'
    // )
    const getIsSleep = Storage.getBoolean(Constants.timerObject.SLEEP)
    if (getIsSleep) {
      TimeHandler.start()
    }

    Emitter.addListener('onSleep', () => {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: Screens.SleepScreen
            }
          ]
        })
      )
    })
    Emitter.addListener('onSleepEnd', () => {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: Screens.HomeScreen
            }
          ]
        })
      )
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const userData = Storage.getStorageData(Constants.asyncStorageKeys.userData)
    const {ANDROID_ID} = SystemInfo
    if (userData && ANDROID_ID) {
      start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => setTimeout(() => SplashScreen.hide(), 2000)}
    >
      <Stack.Navigator
        screenOptions={Utility.navigationOptions}
        initialRouteName={userData ? Screens.HomeScreen : Screens.OnBoardScreen}
      >
        <Stack.Screen name={Screens.OnBoardScreen} component={OnBoardScreen} />
        <Stack.Screen name={Screens.UpdateScreen} component={UpdateScreen} />

        <Stack.Screen name={Screens.WifiConnectScreen} component={WifiConnectScreen} />
        <Stack.Screen name={Screens.FrameConnectScreen} component={FrameConnectScreen} />
        <Stack.Screen name={Screens.HomeScreen} component={HomeScreen} />
        <Stack.Screen name={Screens.GalleryScreen} component={GalleryScreen} />
        <Stack.Screen name={Screens.SettingScreen} component={SettingScreen} />
        <Stack.Screen name={Screens.SleepScreen} component={SleepScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
