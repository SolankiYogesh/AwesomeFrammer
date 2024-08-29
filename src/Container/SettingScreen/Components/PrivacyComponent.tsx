import React from 'react'
import {StyleSheet} from 'react-native'
import WebView from 'react-native-webview'
import styled from 'styled-components/native'

import {LoadingView} from '@/Components'
import {useDeviceOrientation} from '@/Hooks'
import EndPoints from '@/Network/EndPoints'
import {Colors} from '@/Theme'
import {CommonStyles} from '@/Theme/CommonStyle'
import {moderateScale} from '@/Theme/Responsive'

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
          uri: EndPoints.privacy
        }}
        renderLoading={() => <LoadingView style={StyleSheet.absoluteFill} />}
      />
    </RoundContainer>
  )
}
export const RoundContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: ${moderateScale(10)}px;
  border-width: 1px;
  border-color: ${Colors.borderColor};
  margin: ${20}px;
  overflow: hidden;
`
