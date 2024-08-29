import React, {useMemo} from 'react'
import {Image} from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import styled from 'styled-components/native'

import {Colors, Fonts} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyle'
import {moderateScale, scale} from '../../../Theme/Responsive'
import {TOnBoardItem} from '../onBoardScreen'
import {useDeviceOrientation} from '@/Hooks'

const Container = styled.View<{
  width: number
}>`
  width: ${({width}) => width}px;
  align-items: center;
  align-self: center;
`
const ImageContainer = styled.View<{
  width: number
  height: number
}>`
  width: ${({width}) => width * 0.8}px;
  height: ${({height}) => height * 0.6}px;
  align-items: center;
  align-self: center;
`

const TitleText = styled.Text`
  color: ${Colors.themeColor};
  font-size: ${moderateScale(30)}px;
  font-family: ${Fonts.ThemeSemiBold};
  text-align: center;
  margin-top: ${scale(16)}px;
`

const DescText = styled.Text`
  color: ${Colors.buttonBackGround};
  font-size: ${moderateScale(15)}px;
  font-family: ${Fonts.ThemeMedium};
  text-align: center;
  margin-bottom: ${scale(8)}px;
`

const AnimatedDescText = Animated.createAnimatedComponent(DescText)
const AnimatedTitleText = Animated.createAnimatedComponent(TitleText)
const AnimatedImageContainer = Animated.createAnimatedComponent(ImageContainer)

interface OnBoardItemProps {
  item: TOnBoardItem
  index: number
  scrollX: Animated.SharedValue<number>
}

export default ({item, index, scrollX}: OnBoardItemProps) => {
  const {W_WIDTH, W_HEIGHT} = useDeviceOrientation()
  const inputRange = useMemo(() => {
    const start = (index - 1) * W_WIDTH
    const end = (index + 1) * W_WIDTH
    return [start, index * W_WIDTH, end]
  }, [W_WIDTH, index])

  const titleAStyle = useAnimatedStyle(() => {
    const titleTranslateX = interpolate(scrollX.value, inputRange, [W_WIDTH, 0, -W_WIDTH])

    return {
      transform: [{translateX: withDelay(0, withSpring(titleTranslateX))}]
    }
  })
  const descriptionAStyle = useAnimatedStyle(() => {
    const descriptionTrnalsateX = interpolate(scrollX.value, inputRange, [W_WIDTH, 0, -W_WIDTH])

    return {
      transform: [{translateX: withDelay(100, withSpring(descriptionTrnalsateX))}]
    }
  })
  const imageAStyle = useAnimatedStyle(() => {
    const imageTranslateX = interpolate(scrollX.value, inputRange, [W_WIDTH, 0, -W_WIDTH])

    return {
      transform: [{translateX: withDelay(300, withTiming(imageTranslateX))}]
    }
  })

  return (
    <Container width={W_WIDTH}>
      <AnimatedTitleText style={titleAStyle}>{item?.title}</AnimatedTitleText>
      <AnimatedDescText style={descriptionAStyle}>{item?.text}</AnimatedDescText>
      <AnimatedImageContainer width={W_WIDTH} height={W_HEIGHT} style={imageAStyle}>
        <Image source={item?.image} resizeMode={'contain'} style={CommonStyles.fullView} />
      </AnimatedImageContainer>
    </Container>
  )
}
