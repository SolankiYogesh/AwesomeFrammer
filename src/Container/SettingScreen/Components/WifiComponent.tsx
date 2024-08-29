import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {FlatList, ToastAndroid, View} from 'react-native'
import {SvgXml} from 'react-native-svg'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import WifiManager, {WifiEntry} from 'react-native-wifi-reborn'
import _ from 'lodash'
import styled from 'styled-components/native'

import {LoadingView} from '@/Components'
import WifiItem from '@/Components/WifiItem'
import {useDeviceOrientation} from '@/Hooks'
import SVGByteCode from '@/Resources/SVG/SVGByteCode'
import {Colors, Fonts} from '@/Theme'
import {CommonStyles, CommonText, SeparatorH} from '@/Theme/CommonStyle'
import {moderateScale, scale, verticalScale} from '@/Theme/Responsive'

export default () => {
  const [connections, setConnections] = useState<WifiEntry[]>([])

  const [connectedSSID, setConnectedSSID] = useState('')
  const isNotMouted = useRef(true)
  const {t} = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const {widthPx} = useDeviceOrientation()

  const scanWifi = useCallback((connectedSSID: string = '') => {
    setIsLoading(isNotMouted.current)
    isNotMouted.current = false
    WifiManager.reScanAndLoadWifiList().then((response) => {
      if (typeof response !== 'string') {
        const filter = _.filter(
          response,
          (i) => i.SSID !== connectedSSID && i.SSID !== '(hidden SSID)'
        )
        setConnections(filter)
        setIsLoading(false)
      } else {
        ToastAndroid.show(response, ToastAndroid.SHORT)
        setIsLoading(false)
      }
    })
  }, [])

  const checkConnection = useCallback(() => {
    WifiManager.getCurrentWifiSSID()
      .then((ssid) => {
        const acutalSSID = ssid === '0x' ? '' : ssid
        setConnectedSSID(acutalSSID)
        scanWifi(acutalSSID)
      })
      .catch(() => {
        scanWifi()
      })
  }, [scanWifi])

  useEffect(() => {
    checkConnection()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setIsLoading(true)
    let connectedSSID: string
    WifiManager.getCurrentWifiSSID().then((ssid) => {
      connectedSSID = ssid
      setConnectedSSID(ssid)
    })

    WifiManager.reScanAndLoadWifiList()
      .then((response) => {
        if (typeof response !== 'string') {
          const filter = _.filter(
            response,
            (i) => i.SSID !== connectedSSID && i.SSID !== '(hidden SSID)'
          )
          setConnections(filter)
        }

        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const renderEmpty = useMemo(() => {
    return (
      <View style={[CommonStyles.centerItem, CommonStyles.flex]}>
        <CommonText size={16} font={Fonts.ThemeRegular} color={Colors.subTextColor} textCenter>
          {t('S17')}
        </CommonText>
      </View>
    )
  }, [t])

  const renderCurrent = useMemo(() => {
    return (
      <ViewContainer>
        <ItemContainer width={widthPx(70) * 0.9}>
          <ImageContainer>
            <SvgXml
              width={verticalScale(18)}
              height={verticalScale(18)}
              xml={SVGByteCode.wifi(Colors.themeColor)}
            />
          </ImageContainer>
          <SeparatorH val={8} />
          <CommonText size={14} font={Fonts.ThemeRegular} color={Colors.themeColor}>
            {connectedSSID}
          </CommonText>
        </ItemContainer>
      </ViewContainer>
    )
  }, [connectedSSID, widthPx])

  return (
    <View style={CommonStyles.flex}>
      {!!connectedSSID && renderCurrent}
      <TitleContainer style={CommonStyles.row}>
        <LabelContainer>
          <CommonText size={moderateScale(13.5)} color={Colors.subTextColor}>
            {t('S33')}
          </CommonText>
        </LabelContainer>
        <Circle onPress={() => scanWifi(connectedSSID)}>
          <MaterialCommunityIcons name={'refresh'} size={verticalScale(16)} />
        </Circle>
      </TitleContainer>
      {isLoading ? (
        <LoadingView />
      ) : (
        <FlatList
          data={connections}
          contentContainerStyle={connections.length < 1 && CommonStyles.flex}
          renderItem={({item}) => (
            <WifiItem
              onConnect={checkConnection}
              isConnected={item.SSID === connectedSSID}
              item={item}
            />
          )}
          showsVerticalScrollIndicator
          ListEmptyComponent={() => renderEmpty}
          keyExtractor={(_, index) => `key_${index}`}
        />
      )}
    </View>
  )
}
const ItemContainer = styled.TouchableOpacity<{
  isConnected?: boolean
  width: number
}>`
  flex-direction: row;
  align-items: center;
  padding: ${scale(7)}px;
  margin-left: ${scale(5)}px;
  margin-right: ${scale(5)}px;

  width: ${({width}) => width};
  align-self: center;
  ${(props: any) => props?.isConnected && `border-color: ${Colors.themeColor}`};
  ${(props: any) => props?.isConnected && `border-width: 2px`};
  ${(props: any) => props?.isConnected && `border-radius: ${moderateScale(8)}px`};
`
const ImageContainer = styled.View``

const ViewContainer = styled.View`
  background-color: ${Colors.borderColor10};
  border-radius: ${moderateScale(10)}px;
  width: 100%;
  align-self: center;
  margin-top: ${verticalScale(5)}px;
  margin-bottom: ${verticalScale(5)}px;
`
const Circle = styled.TouchableOpacity`
  width: ${50}px;
  height: ${50}px;
  align-self: center;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.borderColor};
  border-radius: 300px;
`
const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  align-self: center;
`
const LabelContainer = styled.View`
  align-self: center;
  margin-left: ${verticalScale(10)}px;
  margin-right: ${verticalScale(10)}px;
`
