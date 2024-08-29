import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Image} from 'react-native'
import {useNetInfo} from '@react-native-community/netinfo'
import styled from 'styled-components/native'

import {navigationRef} from '@/Routes/RootNavigation'
import {Colors, Constants, Images, Screens, Storage} from '@/Theme'

export default forwardRef((_, ref) => {
  const {t} = useTranslation()
  const [isMonitoring, setIsMonitoring] = useState(false)
  const {isConnected} = useNetInfo()

  const onPress = useCallback(() => {
    navigationRef.current?.navigate(Screens.SettingScreen, {
      initialIndex: 1
    })
  }, [])

  useEffect(() => {
    const auth_token = Storage.getString(Constants.asyncStorageKeys.Token)
    setIsMonitoring(!!auth_token)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        setIsMonitoring(true)
      }
    }),
    []
  )

  if (!isMonitoring || isConnected) {
    return null
  }

  return (
    <Container>
      <CenterView>
        <Image source={Images.cloud} />
        <NormalText color={Colors.black}>
          {t('S52')}
          {t('S53')}
          {t('S54')}
        </NormalText>
        <NormalText onPress={onPress} color={Colors.themeColor}>
          {t('S55')}
        </NormalText>
      </CenterView>
    </Container>
  )
})

const Container = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.greyShadeFBFB};
  padding: 10px;
  column-gap: 10px;
  position: absolute;
  bottom: 0;
`
const CenterView = styled.View`
  flex-direction: row;
  align-items: center;
`
const NormalText = styled.Text<{
  color?: string
}>`
  color: ${({color}) => color};
  font-size: 14px;
  margin-left: 10px;
`
