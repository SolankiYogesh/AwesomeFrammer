import React, {useCallback, useEffect, useMemo} from 'react'
import {Pressable, StyleSheet} from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'

import {Colors} from '@/Theme'

interface RNSwitchProps {
  handleOnPress?: (state: boolean) => void
  value?: boolean
}

const thumbColor = Colors.white
export default (props: RNSwitchProps) => {
  const {handleOnPress = () => {}, value = false} = props
  const switchTranslate = useSharedValue(0)

  const config = useMemo(
    () => ({
      damping: 15,
      mass: 1,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
      overshootClamping: false,
      stiffness: 120
    }),
    []
  )

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        switchTranslate.value,
        [0, 22],
        [Colors.greyShade7878, Colors.themeColor]
      )
    }
  }, [])

  useEffect(() => {
    if (value) {
      switchTranslate.value = withSpring(21, config)
    } else {
      switchTranslate.value = withSpring(0, config)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, config])

  const memoizedOnSwitchPressCallback = useCallback(() => {
    if (handleOnPress) {
      handleOnPress(!value)
    }
  }, [handleOnPress, value])

  return (
    <Pressable onPress={memoizedOnSwitchPressCallback}>
      <Animated.View style={[styles.containerStyle, animatedStyle]}>
        <Animated.View
          style={[
            styles.circleStyle,
            {backgroundColor: thumbColor},
            {
              transform: [
                {
                  translateX: switchTranslate
                }
              ]
            },
            styles.shadowValue
          ]}
        />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  circleStyle: {
    width: 24,
    height: 24,
    borderRadius: 24
  },
  containerStyle: {
    width: 50,
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 36.5
  },
  shadowValue: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4
  }
})
