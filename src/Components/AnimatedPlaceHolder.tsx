import React, {useEffect} from 'react'
import {Pressable, StyleSheet} from 'react-native'
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import {Colors, Fonts} from '../Theme'
import {INPUT_HEIGHT, moderateScale, scale} from '../Theme/Responsive'

interface AnimatedPlaceHolderProps {
  isFocus?: boolean
  placeholder?: string
  isError?: boolean
  onFocus?: () => void
}

const ConstantPosition = -INPUT_HEIGHT / 2
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(Pressable)

const AnimatedPlaceHolder = (props: AnimatedPlaceHolderProps) => {
  const {isFocus, placeholder, isError, onFocus} = props
  const translateY = useSharedValue(0)

  useEffect(() => {
    translateY.value = withTiming(isFocus ? ConstantPosition : ConstantPosition / 8)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocus])

  const animatedTouchableOpacityStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value
        }
      ]
    }
  }, [translateY.value, ConstantPosition])
  const animatedPlaceHolderStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        translateY.value,
        [0, ConstantPosition],
        [Colors.borderColor, isFocus ? Colors.themeColor : Colors.borderColor]
      ),
      fontSize: interpolate(translateY.value, [0, ConstantPosition], [16, 12])
    }
  }, [translateY.value, ConstantPosition])

  return (
    <AnimatedTouchableOpacity
      onPress={onFocus}
      style={[styles.animateButton, animatedTouchableOpacityStyle]}
    >
      <Animated.Text
        style={[
          styles.placeHolderStyle,
          animatedPlaceHolderStyle,
          {
            color: isError ? Colors.redShadeD3 : isFocus ? Colors.themeColor : Colors.borderColor
          }
        ]}
      >
        {placeholder}
      </Animated.Text>
    </AnimatedTouchableOpacity>
  )
}

export default AnimatedPlaceHolder

const styles = StyleSheet.create({
  animateButton: {
    zIndex: 1000,
    padding: scale(2),
    marginLeft: scale(5),
    alignSelf: 'flex-start',
    position: 'absolute',
    backgroundColor: Colors.white,
    top: Math.abs(ConstantPosition) / 2
  },
  placeHolderStyle: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    fontFamily: Fonts.ThemeRegular,
    color: Colors.borderColor,
    overflow: 'hidden',
    zIndex: 1000,
    paddingHorizontal: scale(5)
  }
})
