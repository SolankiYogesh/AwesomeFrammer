import React, {useCallback, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {View} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import {toast} from '@backpackapp-io/react-native-toast'
import _ from 'lodash'
import styled from 'styled-components/native'

import {AppButton, AppScrollView, Loader} from '../../Components'
import EndPoints from '../../Network/EndPoints'
import {Colors, Constants, Fonts, Images, Storage} from '../../Theme'
import {AppContainer, CommonStyles, CommonText, Separator} from '../../Theme/CommonStyle'
import constants from '../../Theme/Constants'
import {scale} from '../../Theme/Responsive'
import OTPInput from './Components/OTPInput'
import {useDeviceOrientation} from '@/Hooks'
import {SystemInfo} from '@/Modules/useSystemUpdate'
import APICall from '@/Network/APICall'
import Utility from '@/Theme/Utility'

export default () => {
  const {t} = useTranslation()
  const [otpCode, setOTPCode] = useState<string>('')
  const [scannerCode, setScannerCode] = useState<string>('')
  const {widthPx, isLandScape, moderateScale} = useDeviceOrientation()
  useEffect(() => {
    const getUserData = () => {
      const otpCode = Storage.getString(Constants.asyncStorageKeys.OTP) || ''
      setScannerCode(otpCode)
    }
    getUserData()
  }, [])

  const onPressButton = useCallback(async () => {
    const auth_token = Storage.getString(Constants.asyncStorageKeys.Token)
    const {ANDROID_ID} = SystemInfo
    if (!_.trim(otpCode)) {
      toast.error('Invalid Code', 'Error', {duration: 5000, image: Images.toast})
      return
    }
    const payload = {
      device_id: ANDROID_ID,
      connect_code: otpCode,
      auth_token
    }

    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    Loader.isLoading(true)
    APICall('post', payload, EndPoints.connectFrameWithDevice)
      .then((response: any) => {
        Loader.isLoading(false)
        if (response?.statusCode === 200 && response?.data) {
          Storage.setStorageData(constants.asyncStorageKeys.userData, response)
          constants.commonConstant.appUser = response
        } else {
          if (response?.statusCode === 400) {
            toast.error(response?.data?.message, 'Invalid Code')
          }
        }
      })
      .catch(() => {
        Loader.isLoading(false)
      })
  }, [otpCode])

  const renderScannerCode = () => {
    return (
      <ImageBGView size={widthPx(30)} source={Images.scannerBorder}>
        <QRCode
          value={scannerCode || 'NoCode'}
          size={widthPx(25)}
          backgroundColor={Colors.orangeColorFF}
        />
      </ImageBGView>
    )
  }
  const renderCodeItem = () => {
    return (
      <CodeView>
        <CommonText size={moderateScale(14)}>{t('S26')}</CommonText>
        <OTPInput
          maximumLength={6}
          setIsPinReady={() => {}}
          code={otpCode}
          setCode={setOTPCode}
          height={40}
          keyboardType={'default'}
        />
      </CodeView>
    )
  }

  return (
    <AppContainer noPadding>
      <AppScrollView contentContainerStyle={[CommonStyles.flex, CommonStyles.flexGrow]}>
        <InnerContainer isLandScape={isLandScape}>
          <FlexView color={Colors.transparent}>
            <View style={CommonStyles.selfCenter}>
              <CommonText size={30} font={Fonts.ThemeSemiBold} color={Colors.themeColor}>
                {t('S18')}
              </CommonText>
              <CommonText size={15}>{t('dummyText')}</CommonText>
            </View>
          </FlexView>
          <FlexView color={Colors.orangeColorFF}>
            <View style={CommonStyles.selfCenter}>
              <Separator val={15} />
              {renderScannerCode()}
              <Separator val={10} />
              <CommonText
                size={moderateScale(13.5)}
                color={Colors.black}
                textCenter
                font={Fonts.ThemeRegular}
              >
                {t('S20')}
              </CommonText>
              <Separator val={10} />
              {renderCodeItem()}
              <Separator val={10} />
              <AppButton
                disabled={!otpCode && otpCode.length <= 6}
                onPress={onPressButton}
                title={t('S19')}
                innerStyle={{
                  paddingHorizontal: scale(20)
                }}
              />
            </View>
          </FlexView>
        </InnerContainer>
      </AppScrollView>
    </AppContainer>
  )
}

const InnerContainer = styled.View<{
  isLandScape: boolean
}>`
  flex: 1;
  flex-direction: ${({isLandScape}) => (isLandScape ? 'row' : 'column')};
`

const FlexView = styled.View<{
  color: string
}>`
  flex: 1;
  align-content: center;
  justify-content: center;
  background-color: ${({color}) => color};
`

const ImageBGView = styled.ImageBackground<{
  size: number
}>`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  align-items: center;
  justify-content: center;
  align-self: center;
`
const CodeView = styled.View`
  align-self: center;
  padding-left: ${scale(20)}px;
  padding-right: ${scale(20)}px;
`
