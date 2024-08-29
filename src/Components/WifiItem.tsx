import React, {useCallback, useMemo, useState} from 'react'
import {Keyboard, ToastAndroid} from 'react-native'
import {SvgXml} from 'react-native-svg'
import WifiManager, {WifiEntry} from 'react-native-wifi-reborn'
import styled from 'styled-components/native'

import WifiModalView from './WifiModalView'
import SVGByteCode from '@/Resources/SVG/SVGByteCode'
import {Colors, Fonts} from '@/Theme'
import {CommonText, SeparatorH} from '@/Theme/CommonStyle'
import {moderateScale, scale, verticalScale} from '@/Theme/Responsive'

interface WifiItemProps {
  item: WifiEntry
  isConnected: boolean
  onConnect: () => void
}
export default ({item, isConnected, onConnect}: WifiItemProps) => {
  const [isModal, setIsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isProtected = useMemo(
    () =>
      item?.capabilities?.includes('WPA') ||
      item?.capabilities?.includes('WPA2') ||
      item?.capabilities?.includes('WPS'),
    [item?.capabilities]
  )

  const onPressConnect = useCallback(
    (password: string | null) => {
      setIsModal(false)
      Keyboard.dismiss()
      setIsLoading(true)
      const param = {ssid: item.SSID, password}

      WifiManager.connectToProtectedWifiSSID(param)
        .then(() => {
          onConnect()
          setIsLoading(false)
        })
        .catch(({message}) => {
          if (message && typeof message === 'string') {
            ToastAndroid.show(message, ToastAndroid.SHORT)
          }

          setIsLoading(false)
        })
    },
    [item.SSID, onConnect]
  )

  const onPressItem = useCallback(() => {
    if (isProtected) {
      setIsModal(true)
    } else {
      onPressConnect(null)
    }
  }, [isProtected, onPressConnect])

  return (
    <React.Fragment>
      <ItemContainer isConnected={isConnected} onPress={onPressItem}>
        <SvgXml
          width={verticalScale(20)}
          height={verticalScale(20)}
          xml={isProtected ? SVGByteCode.wifiLock() : SVGByteCode.wifi()}
        />

        <SeparatorH val={8} />
        <CommonText size={14} font={Fonts.ThemeRegular}>
          {item.SSID}
        </CommonText>
        {isLoading && <Loader color={Colors.themeColor} />}
      </ItemContainer>
      {isModal && (
        <WifiModalView
          ssid={item.SSID}
          onPress={onPressConnect}
          onClose={() => setIsModal(false)}
        />
      )}
    </React.Fragment>
  )
}

const ItemContainer = styled.TouchableOpacity<{
  isConnected?: boolean
}>`
  flex-direction: row;
  align-items: center;
  padding: ${scale(7)}px;
  margin-left: ${verticalScale(5)}px;
  margin-right: ${verticalScale(5)}px;
  width: 90%;
  align-self: center;
  ${(props) => props?.isConnected && `border-color: ${Colors.themeColor}`};
  ${(props) => props?.isConnected && `border-width: 2px`};
  ${(props) => props?.isConnected && `border-radius: ${moderateScale(8)}px`};
`
const Loader = styled.ActivityIndicator`
  margin-left: auto;
`
