import React from 'react'
import {StyleSheet} from 'react-native'
import WebView from 'react-native-webview'

import {RoundContainer} from './PrivacyComponent'
import {LoadingView} from '@/Components'
import {useDeviceOrientation} from '@/Hooks'
import EndPoints from '@/Network/EndPoints'
import {CommonStyles} from '@/Theme/CommonStyle'

export default () => {
  const {widthPx, isLandScape} = useDeviceOrientation()

  return (
    <RoundContainer
      style={{
        width: widthPx(isLandScape ? 70 : 62) - 40, // 40 is left and right margin
        ...CommonStyles.flex
      }}
    >
      <WebView
        style={{
          width: widthPx(isLandScape ? 70 : 62) - 40, // 40 is left and right margin
          ...CommonStyles.flex
        }}
        source={{
          uri: EndPoints.TNC
        }}
        renderLoading={() => <LoadingView style={StyleSheet.absoluteFill} />}
      />
    </RoundContainer>
  )
}
