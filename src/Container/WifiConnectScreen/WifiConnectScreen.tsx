import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {FlatList, ToastAndroid, View} from 'react-native'
import {SvgXml} from 'react-native-svg'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import WifiManager, {WifiEntry} from 'react-native-wifi-reborn'
import {toast} from '@backpackapp-io/react-native-toast'
import _ from 'lodash'
import {styled} from 'styled-components/native'

import {AppButton, ConnectionController, Loader, LoadingView} from '../../Components'
import {useDeviceOrientation, useMedia, useNavigation} from '../../Hooks'
import EndPoints from '../../Network/EndPoints'
import {Colors, Constants, Fonts, Screens, Storage} from '../../Theme'
import {
  AppContainer,
  CommonStyles,
  CommonText,
  Separator,
  SeparatorH
} from '../../Theme/CommonStyle'
import {moderateScale, scale, verticalScale} from '../../Theme/Responsive'
import WifiItem from '@/Components/WifiItem'
import {SystemInfo} from '@/Modules/useSystemUpdate'
import APICall from '@/Network/APICall'
import SVGByteCode from '@/Resources/SVG/SVGByteCode'
import Utility from '@/Theme/Utility'

export default () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const [connections, setConnections] = useState<WifiEntry[]>([])
  const [connectedSSID, setConnectedSSID] = useState('')
  const isNotMouted = useRef(true)
  const [isLoading, setIsLoading] = useState(true)
  const {start} = useMedia()
  const {W_WIDTH, isLandScape} = useDeviceOrientation()
  const scanWifi = useCallback((connectedSSID: string = '') => {
    setIsLoading(isNotMouted.current)
    isNotMouted.current = false
    WifiManager.reScanAndLoadWifiList()
      .then((response) => {
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
      .catch(() => {
        setIsLoading(false)
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

  const onPressButton = useCallback(async () => {
    const {ANDROID_ID} = SystemInfo
    if (ANDROID_ID) {
      const payload = {
        device_id: ANDROID_ID
      }

      const isInternet = await Utility.isInternet()
      if (!isInternet) {
        return
      }

      Loader.isLoading(true)
      APICall('post', payload, EndPoints.registerFrame)
        .then((response: any) => {
          Loader.isLoading(false)

          if (response?.statusCode === 200 && response?.data) {
            Storage.set(Constants.asyncStorageKeys.Token, response?.data?.data?.auth_token)
            Storage.set(Constants.asyncStorageKeys.OTP, response?.data?.data?.connect_code)
            setTimeout(() => {
              start()
              ConnectionController.show()
            }, 500)
            navigation.navigate(Screens.FrameConnectScreen)
          } else if (response?.statusCode === 409 && response?.data?.already_registered) {
            const token = Storage.getString(Constants.asyncStorageKeys.Token)
            if (token) {
              setTimeout(() => {
                start()
                ConnectionController.show()
                navigation.navigate(Screens.FrameConnectScreen)
              }, 500)
            } else {
              toast.error('Frame is Already Register', 'Already Registered', {
                duration: 5000
              })
            }
          }
        })
        .catch(() => Loader.isLoading(false))
    }
  }, [navigation, start])

  const renderEmpty = () => {
    return (
      <View style={[CommonStyles.centerItem, CommonStyles.flex]}>
        <CommonText size={16} font={Fonts.ThemeRegular} color={Colors.subTextColor} textCenter>
          {t('S17')}
        </CommonText>
      </View>
    )
  }
  const renderHeader = () => {
    return (
      <>
        <CommonText size={30} font={Fonts.ThemeSemiBold} color={Colors.themeColor} textCenter>
          {t('S16')}
        </CommonText>
        <CommonText size={15} textCenter>
          {t('dummyText')}
        </CommonText>
        <Separator />
      </>
    )
  }

  const renderAvailable = () => {
    return (
      <>
        <TitleContainer isLandScape={isLandScape} width={W_WIDTH} style={CommonStyles.row}>
          <LabelContainer>
            <CommonText size={moderateScale(13.5)} color={Colors.subTextColor}>
              {t('S33')}
            </CommonText>
          </LabelContainer>
          <Circle onPress={() => scanWifi(connectedSSID)}>
            <MaterialCommunityIcons name={'refresh'} size={verticalScale(16)} />
          </Circle>
        </TitleContainer>
        <Separator />
        <ViewContainer width={W_WIDTH} isLandScape={isLandScape} style={CommonStyles.flex}>
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
              ListEmptyComponent={renderEmpty}
              keyExtractor={(item, index) => `key_${index}`}
            />
          )}
        </ViewContainer>
      </>
    )
  }

  const renderCurrent = () => {
    return (
      <React.Fragment>
        <LabelContainer>
          <CommonText size={moderateScale(13.5)} color={Colors.subTextColor}>
            {t('S32')}
          </CommonText>
        </LabelContainer>
        <Separator />
        <ViewContainer width={W_WIDTH} isLandScape={isLandScape}>
          <ItemContainer>
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
      </React.Fragment>
    )
  }

  return (
    <AppContainer>
      {renderHeader()}
      {!!connectedSSID && renderCurrent()}
      <Separator />
      {renderAvailable()}

      <AppButton
        disabled={!_.trim(connectedSSID)}
        onPress={onPressButton}
        style={CommonStyles.buttonStyle}
        title={t('S13')}
      />
    </AppContainer>
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
const ImageContainer = styled.View``

const LabelContainer = styled.View`
  align-self: center;
  margin-left: ${verticalScale(10)}px;
  margin-right: ${verticalScale(10)}px;
`

const ViewContainer = styled.View<{
  isLandScape: boolean
  width: number
}>`
  background-color: ${Colors.borderColor10};
  border-radius: ${moderateScale(10)}px;
  width: ${({width, isLandScape}) => width * (isLandScape ? 0.58 : 0.8)}px;
  align-self: center;
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
const TitleContainer = styled.View<{
  isLandScape: boolean
  width: number
}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: ${({width, isLandScape}) => width * (isLandScape ? 0.58 : 0.8)}px;
  align-self: center;
`
