import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {ImageBackground, View} from 'react-native'
import * as Progress from 'react-native-progress'
import Animated, {FadeInRight} from 'react-native-reanimated'
import styled from 'styled-components/native'

import {AppButton} from '@/Components'
import {useDeviceOrientation} from '@/Hooks'
import useSystemUpdate from '@/Modules/useSystemUpdate'
import {Colors, Fonts, Images} from '@/Theme'
import {CommonStyles, CommonText} from '@/Theme/CommonStyle'
import {moderateScale, verticalScale} from '@/Theme/Responsive'

export default () => {
  const {scale, isLandScape, widthPx} = useDeviceOrientation()
  const [isDownloadScreen, setIsDownloadScreen] = useState(false)
  const {progress, isBufferring} = useSystemUpdate()
  const {t} = useTranslation()
  return !isDownloadScreen ? (
    <ImageBackground source={Images.updateBack} style={CommonStyles.fullView}>
      <Container>
        <RocketImage top={-150} source={Images.rocket} />
        <InnerContainer isLandScape={isLandScape}>
          <TitleText>{t('S64')}</TitleText>
          <FeatureText>{t('dummyText')}</FeatureText>
          <AppButton
            innerStyle={{
              paddingHorizontal: scale(10)
            }}
            onPress={() => {
              // install()
              setIsDownloadScreen(true)
            }}
            title={'Download Update'}
          />
          <CommonText textCenter>{t('S14')}</CommonText>
        </InnerContainer>
      </Container>
    </ImageBackground>
  ) : (
    <Animated.View entering={FadeInRight} style={CommonStyles.fullView}>
      <TitleText top={verticalScale(15)} size={moderateScale(35)}>
        {t('S65')}
      </TitleText>
      <View style={[CommonStyles.flex, CommonStyles.centerItem]}>
        <RocketImage top={isLandScape ? 150 : 300} source={Images.rocket} />
        <FeatureText>{t('S65')}</FeatureText>
        <Progress.Bar
          indeterminate={isBufferring}
          progress={progress / 100}
          width={widthPx(50)}
          style={{margin: scale(8)}}
          borderWidth={0}
          unfilledColor={Colors.greyShadeA0}
          color={Colors.themeColor}
        />
      </View>
    </Animated.View>
  )
}
const Container = styled.View`
  margin-top: auto;
  flex: 0.6;
`
const TitleText = styled.Text<{
  size?: number
  top?: number
}>`
  font-family: ${Fonts.ThemeSemiBold};
  font-weight: 500;
  color: ${Colors.themeSecondary};
  font-size: ${({size}) => size ?? moderateScale(18)}px;
  text-align: center;
  margin-top: ${({top}) => top ?? 0}px;
`
const FeatureText = styled.Text`
  font-family: ${Fonts.ThemeMedium};
  font-weight: 500;
  color: ${Colors.black};
  font-size: ${moderateScale(13)}px;
`

const InnerContainer = styled.View<{
  isLandScape: boolean
}>`
  width: ${({isLandScape}) => (isLandScape ? 50 : 65)}%;
  gap: ${({isLandScape}) => (isLandScape ? 20 : 40)}px;
  margin: 20px;
  align-self: center;
`

const RocketImage = styled.Image<{
  top?: number
}>`
  width: 80px;
  height: 150px;
  position: absolute;
  align-self: center;
  top: ${({top}) => top}px;
`
