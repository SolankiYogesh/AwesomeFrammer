import React from 'react'
import {LogBox, StatusBar} from 'react-native'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {Toasts} from '@backpackapp-io/react-native-toast'

import {CommonStyles} from './src/Theme/CommonStyle'
import MediaProvider from '@/Components/MediaProvider'
import StartComponent from '@/Container/StartComponent'

LogBox.ignoreAllLogs()
StatusBar.setHidden(true)
StatusBar.setTranslucent(true)

const App = () => {
  return (
    <GestureHandlerRootView style={CommonStyles.flex}>
      <SafeAreaProvider>
        <MediaProvider>
          <StartComponent />
          <Toasts />
        </MediaProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
