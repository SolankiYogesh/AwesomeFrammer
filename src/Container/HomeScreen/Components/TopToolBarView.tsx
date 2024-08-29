import React, {useCallback, useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {FlatList} from 'react-native'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import {SvgXml} from 'react-native-svg'
import styled from 'styled-components/native'

import AddFriendModal from './AddFriendModal'
import {useDeviceOrientation, useNavigation} from '@/Hooks'
import SVGByteCode from '@/Resources/SVG/SVGByteCode'
import {Screens} from '@/Theme'
import {CommonStyles, CommonText, Separator} from '@/Theme/CommonStyle'
import {moderateScale, scale, verticalScale} from '@/Theme/Responsive'
import Utility from '@/Theme/Utility'

const TopView = styled.View`
  position: absolute;
  top: ${verticalScale(15)}px;
  border-radius: ${moderateScale(10)}px;
  align-self: center;
  z-index: 1000;
`
const AnimatedTopView = Animated.createAnimatedComponent(TopView)

export default () => {
  const {heightPx, isLandScape} = useDeviceOrientation()
  const HEGIHT = useMemo(() => heightPx(isLandScape ? 15 : 12), [heightPx, isLandScape])
  const {t} = useTranslation()
  const optionList = useMemo(
    () => [
      {
        id: 0,
        title: t('S23'),
        icon: SVGByteCode.settingToolbar()
      },
      {
        id: 1,
        title: t('S24'),
        icon: SVGByteCode.gallery()
      },
      {
        id: 2,
        title: t('S25'),
        icon: SVGByteCode.addFriend()
      }
    ],
    [t]
  )
  const navigation = useNavigation()
  const [showAddFriendModal, setShowAddFriendModal] = useState(false)
  const translateY = useSharedValue(0)
  const context = useSharedValue(0)

  const close = useCallback(() => {
    translateY.value = withTiming(-HEGIHT - 5)
  }, [HEGIHT, translateY])

  const open = useCallback(() => {
    translateY.value = withTiming(0)
  }, [translateY])

  const gesture = Gesture.Pan()
    .hitSlop({
      bottom: 100
    })
    .onStart(() => {
      context.value = translateY.value
    })
    .onUpdate((event) => {
      const y = event.translationY + context.value

      translateY.value = clamp(y, -HEGIHT, 0)
    })
    .onEnd((event) => {
      const y = event.translationY + context.value

      if (y < -HEGIHT / 2) {
        runOnJS(close)()
      } else {
        runOnJS(open)()
      }
    })

  const onPress = useCallback(
    (index: number) => {
      if (index === 0) {
        navigation.navigate(Screens.SettingScreen)
      } else if (index === 1) {
        navigation.navigate(Screens.GalleryScreen)
      } else {
        setShowAddFriendModal(true)
      }
    },
    [navigation]
  )

  const renderTopItem = useCallback(
    ({item, index}: any) => {
      return (
        <TopRenderView onPress={() => onPress(index)}>
          <TopImageView>
            <SvgXml width={verticalScale(30)} height={verticalScale(30)} xml={item.icon} />
          </TopImageView>
          <Separator val={2} />
          <CommonText size={14} textCenter>
            {item?.title}
          </CommonText>
        </TopRenderView>
      )
    },
    [onPress]
  )

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value
        }
      ]
    }
  }, [translateY.value])

  const onInitialAnimation = useCallback(() => {
    Utility.wait(2000).then(() => {
      translateY.value = withTiming(-HEGIHT - 5)
    })
  }, [HEGIHT, translateY])

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedTopView
        collapsable={false}
        style={animatedStyle}
        onLayout={() => {
          translateY.value = withTiming(0, {}, (isFinish) => {
            if (isFinish) {
              runOnJS(onInitialAnimation)()
            }
          })
        }}
      >
        <FlatList
          data={optionList}
          horizontal
          style={[
            CommonStyles.shadow,
            CommonStyles.fullView,
            {
              borderRadius: moderateScale(10),
              padding: scale(10)
            }
          ]}
          keyExtractor={(item, index) => `key_${item.id}${index}`}
          renderItem={renderTopItem}
          showsVerticalScrollIndicator={false}
        />

        {showAddFriendModal && (
          <AddFriendModal
            isVisible={showAddFriendModal}
            onCloseModal={() => setShowAddFriendModal(false)}
          />
        )}
      </AnimatedTopView>
    </GestureDetector>
  )
}

const TopRenderView = styled.TouchableOpacity`
  align-items: center;
  width: ${scale(60)}px;
`
const TopImageView = styled.View`
  height: ${verticalScale(30)}px;
  width: ${scale(30)}px;
  justify-content: center;
  align-items: center;
`
