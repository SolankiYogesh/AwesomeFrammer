import React from 'react'
import {
  type ImageSourcePropType,
  type ImageStyle,
  PressableProps,
  type StyleProp,
  type TextStyle,
  View,
  type ViewStyle
} from 'react-native'
import Animated, {AnimatedProps} from 'react-native-reanimated'
import styled from 'styled-components/native'

import {useRipple} from '../Hooks'
import {Colors, Fonts} from '../Theme'
import {CommonStyles} from '../Theme/CommonStyle'
import {INPUT_HEIGHT, moderateScale, verticalScale, VIEW_RADIUS} from '../Theme/Responsive'

type ModeType = 'fill' | 'outline'
interface AppButtonProps extends AnimatedProps<PressableProps> {
  title?: string
  bgColor?: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  onPress?: () => void
  leftImage?: ImageSourcePropType
  leftImageStyle?: StyleProp<ImageStyle>
  disabled?: boolean
  innerStyle?: StyleProp<ViewStyle>
  mode?: ModeType
}

const RippleView = styled.View<ButtonContainerProps>`
  background-color: ${(props) => (props.isOutLine ? Colors.outLineHover : Colors.themeColor)};
`

const ButtonContainer = styled.Pressable<ButtonContainerProps>`
  width: 80%;
  height: ${INPUT_HEIGHT}px;
  border-radius: ${VIEW_RADIUS}px;
  align-self: center;
  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(10)}px;

  overflow: hidden;
  border-width: ${(props) => (props.disabled ? '2px' : props.isOutLine ? '1px' : '0')};
  border-color: ${(props) =>
    props.disabled
      ? Colors.disableColor
      : props.isOutLine
        ? Colors.themeColor
        : Colors.transparent};
`

const AnimatedButtonContainer = Animated.createAnimatedComponent(ButtonContainer)

const AnimatedView = Animated.createAnimatedComponent(RippleView)
export default (props: AppButtonProps) => {
  const {
    onPress = () => {},
    leftImageStyle = {},
    style = {},
    textStyle = {},
    bgColor = '',
    title = '',
    leftImage,
    disabled = false,
    innerStyle = {},
    mode = 'fill'
  } = props
  const {onLayout, onPressIn, onPressOut, animatedStyle} = useRipple()
  const isOutLine = mode === 'outline'

  return (
    <AnimatedButtonContainer
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      isOutLine={isOutLine}
      disabled={disabled}
      style={style}
      onLayout={onLayout}
      onPress={onPress}
    >
      <View
        style={[
          CommonStyles.flex,
          CommonStyles.centerItem,
          {
            backgroundColor:
              bgColor ||
              (!isOutLine && !disabled
                ? Colors.buttonBackGround
                : disabled && !isOutLine
                  ? Colors.disableColor
                  : Colors.transparent)
          }
        ]}
      >
        <AnimatedView isOutLine={isOutLine} style={animatedStyle} />
        <InnerView style={innerStyle}>
          {!!leftImage && (
            <LeftImageContainer
              style={leftImageStyle}
              source={leftImage}
              resizeMode={'contain'}
              tintColor={Colors.white}
            />
          )}
          <TitleText isOutLine={isOutLine} disabled={disabled} style={textStyle}>
            {title}
          </TitleText>
        </InnerView>
      </View>
    </AnimatedButtonContainer>
  )
}

interface ButtonContainerProps {
  disabled?: boolean
  isOutLine?: boolean
}

const TitleText = styled.Text<ButtonContainerProps>`
  font-family: ${Fonts.ThemeSemiBold};
  font-weight: 500;
  color: ${(props) =>
    props?.disabled ? Colors.disabledText : props.isOutLine ? Colors.themeColor : Colors.white};
  font-size: ${moderateScale(16)}px;
`

const LeftImageContainer = styled.Image`
  height: ${verticalScale(22)}px;
  width: ${verticalScale(22)}px;
`

const InnerView = styled.View`
  flex-direction: row;
  align-items: center;
  column-gap: 10px;
`
