import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native'
import * as Progress from 'react-native-progress'
import moment from 'moment'
import styled from 'styled-components/native'

import {useDeviceOrientation} from '../../../Hooks'
import {Colors, Fonts, Storage} from '../../../Theme'
import useSystemUpdate, {SystemInfo} from '@/Modules/useSystemUpdate'

function formatMilliseconds(ms: number): string {
  // Calculate total seconds from milliseconds
  const totalSeconds = Math.floor(ms / 1000)

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  // Format time as hh:mm:ss with leading zeros
  return [hours, minutes, seconds].map((unit) => unit.toString().padStart(2, '0')).join(':')
}

export default () => {
  const [lastChecked, setLastChecked] = useState('')
  const {t} = useTranslation()
  const {versionName, ANDROID_ID, systemUpTime} = SystemInfo
  const {checkForUpdate, progress, install, isBufferring} = useSystemUpdate()

  const {isLandScape, moderateScale, scale, widthPx, verticalScale} = useDeviceOrientation()
  const [isUpdate, setIsUpdate] = useState(false)
  useEffect(() => {
    const lastChecked = Storage.getString('LastCheck')
    if (lastChecked) {
      setLastChecked(lastChecked)
    }
  }, [])

  const _onCheckServerVersion = async () => {
    checkForUpdate().then((resp) => {
      if (resp) {
        setIsUpdate(resp)
      } else {
        ToastAndroid.show('System is Up to date', ToastAndroid.SHORT)
      }
    })
    Storage.set('LastCheck', moment().toISOString())
  }

  return (
    <MainContainer paddingVertical={verticalScale(8)}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ItemContainer spacing={scale(10)}>
          <TitleText size={moderateScale(12)}>{t('S41')}</TitleText>
          <ValueText size={moderateScale(16)}>{SystemInfo.systemVersion}</ValueText>
          <Line vertical={verticalScale(8)} />
        </ItemContainer>

        <ItemContainer spacing={scale(10)}>
          <TitleText size={moderateScale(12)}>{t('S43')}</TitleText>
          <ValueText size={moderateScale(16)}>{ANDROID_ID}</ValueText>
          <Line vertical={verticalScale(8)} />
        </ItemContainer>

        <ItemContainer spacing={scale(10)}>
          <TitleText size={moderateScale(12)}>{t('S44')}</TitleText>
          <ValueText size={moderateScale(16)}>{versionName}</ValueText>
          <Line vertical={verticalScale(8)} />
        </ItemContainer>

        <ItemContainer spacing={scale(10)}>
          <TitleText size={moderateScale(12)}>{t('S45')}</TitleText>
          <ValueText size={moderateScale(16)}>{formatMilliseconds(systemUpTime)}</ValueText>
          <Line vertical={verticalScale(8)} />
        </ItemContainer>

        <View
          style={[
            styles.raw,
            {
              paddingHorizontal: scale(10),
              width: widthPx(62)
            }
          ]}
        >
          <View>
            <TitleText size={moderateScale(12)}>{t('S46')}</TitleText>
            {progress > 0 || isBufferring ? (
              <Progress.Bar
                progress={progress / 100}
                width={widthPx(isLandScape ? 40 : 20)}
                style={{margin: scale(8)}}
                borderWidth={0}
                indeterminate={isBufferring}
                unfilledColor={Colors.greyShadeA0}
                color={Colors.themeColor}
              />
            ) : (
              <ValueText size={moderateScale(14)}>
                {lastChecked !== null && lastChecked !== ''
                  ? t('S47') + moment(lastChecked).format('MMM DD YYYY')
                  : t('S47') + 'Never'}
              </ValueText>
            )}
          </View>
          <TouchableOpacity
            disabled={progress > 0}
            onPress={isUpdate ? install : _onCheckServerVersion}
          >
            <Text
              style={[
                styles.update,
                {
                  color: progress > 0 ? Colors.greyShade595 : Colors.themeSecondary,
                  fontSize: moderateScale(13)
                }
              ]}
            >
              {isUpdate ? t('S63') : t('S48')}
            </Text>
          </TouchableOpacity>
        </View>
        <Line vertical={verticalScale(8)} />
      </ScrollView>
    </MainContainer>
  )
}

const TitleText = styled.Text<{
  size: number
}>`
  color: ${Colors.black};
  font-family: ${Fonts.ThemeBold};
  font-size: ${({size}) => size}px;
  font-weight: 400;
`

const ValueText = styled.Text<{
  size: number
}>`
  color: ${Colors.black};
  font-family: ${Fonts.ThemeRegular};
  font-size: ${({size}) => size}px;
  font-weight: 400;
`

const Line = styled.View<{
  vertical: number
}>`
  height: 1px;
  background-color: ${Colors.borderColor};
  margin-top: ${({vertical}) => vertical}px;
`

const MainContainer = styled.Text<{
  paddingVertical: number
}>`
  flex: 1;
  padding-top: ${({paddingVertical}) => paddingVertical}px;
  padding-bottom: ${({paddingVertical}) => paddingVertical}px;
  width: 100%;
`

const ItemContainer = styled.View<{
  spacing: number
}>`
  padding-left: ${({spacing}) => spacing}px;
`

const styles = StyleSheet.create({
  raw: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  update: {
    fontFamily: Fonts.ThemeRegular,
    color: Colors.themeSecondary,
    fontWeight: 'bold'
  }
})
