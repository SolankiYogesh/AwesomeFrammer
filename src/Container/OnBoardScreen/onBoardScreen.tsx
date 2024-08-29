import React, {useCallback, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Animated as RNAnimated,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import {ExpandingDot} from 'react-native-animated-pagination-dots'
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'
import styled from 'styled-components/native'

import {AppButton} from '../../Components'
import {useDeviceOrientation, useNavigation} from '../../Hooks'
import {Colors, Images, Screens} from '../../Theme'
import {CommonStyles, CommonText} from '../../Theme/CommonStyle'
import {moderateScale, scale, verticalScale, widthPx} from '../../Theme/Responsive'
import OnBoardItem from './Components/onBoardItem'
import i18n from '@/i18n/i18n'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const pageData = [
  {
    id: 0,
    image: Images.page1,
    buttonText: i18n.t('S13'),
    title: i18n.t('S3'),
    text: i18n.t('S4')
  },
  {
    id: 1,
    image: Images.page2,
    buttonText: i18n.t('S13'),
    title: i18n.t('S5'),
    text: i18n.t('S6')
  },
  {
    id: 2,
    image: Images.page3,
    buttonText: i18n.t('S13'),
    title: i18n.t('S7'),
    text: i18n.t('S8')
  },
  {
    id: 3,
    image: Images.page4,
    buttonText: i18n.t('S13'),
    title: i18n.t('S9'),
    text: i18n.t('S10')
  },
  {
    id: 4,
    image: Images.page5,
    buttonText: i18n.t('S15'),
    title: i18n.t('S11'),
    text: i18n.t('S12')
  }
]

export type TOnBoardItem = {
  id: number
  image: ImageSourcePropType
  title: string
  text: string
  buttonText: string
}

export default () => {
  const {t} = useTranslation()
  const scrollXRN = useRef(new RNAnimated.Value(0)).current
  const navigation = useNavigation()
  const scrollX = useSharedValue(0)
  const activeIndex = useRef(0)
  const {W_WIDTH} = useDeviceOrientation()
  const [buttonText, setButtonText] = useState(pageData[activeIndex.current].buttonText)

  const scrollViewRef = useAnimatedRef<ScrollView>()

  const onChangeDone = useCallback(() => {
    navigation.replace(Screens.WifiConnectScreen, {from: Screens.OnBoardScreen})
  }, [navigation])

  const handleScroll = useCallback(
    (direction: number) => {
      const newIndex = activeIndex.current + direction
      if (newIndex >= 0 && newIndex < pageData.length) {
        activeIndex.current = newIndex
        const newScrollX = W_WIDTH * newIndex
        scrollX.value = newScrollX
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: newScrollX,
            y: 0,
            animated: true
          })
        }, 400)
      }
    },
    [W_WIDTH, scrollViewRef, scrollX]
  )

  const handleNextPress = useCallback(() => {
    if (activeIndex.current === pageData.length - 1) {
      onChangeDone()
    } else {
      handleScroll(1)
    }
  }, [handleScroll, onChangeDone])

  // Set button width and Label s

  const handleSkipPress = () => {
    activeIndex.current = pageData.length - 1
    const newScrollX = W_WIDTH * (pageData.length - 1)
    scrollX.value = newScrollX
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: newScrollX,
        y: 0,
        animated: false
      })
      onChangeDone()
    }, 400)
  }

  const skipButtonStyle = useAnimatedStyle(() => {
    return {
      display: scrollX.value >= W_WIDTH * 4 ? 'none' : 'flex'
    }
  })

  const backButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollX.value, [0, W_WIDTH], [0, 1])
    }
  })

  return (
    <Container>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEnabled={false}
        ref={scrollViewRef}
        scrollEventThrottle={16}
        horizontal
        onScroll={RNAnimated.event([{nativeEvent: {contentOffset: {x: scrollXRN}}}], {
          useNativeDriver: false,
          listener: (event: any) => {
            activeIndex.current = Number(
              Number(event?.nativeEvent?.contentOffset?.x / W_WIDTH).toFixed()
            )
            setButtonText(pageData[activeIndex.current].buttonText)
          }
        })}
        style={CommonStyles.flex}
      >
        {pageData.map((item, index) => {
          return <OnBoardItem key={item.id} scrollX={scrollX} index={index} item={item} />
        })}
      </ScrollView>
      <View style={[CommonStyles.row, styles.horizontalView]}>
        <AnimatedTouchableOpacity onPress={handleSkipPress} style={[styles.skip, skipButtonStyle]}>
          <CommonText size={15} textCenter>
            {t('S14')}
          </CommonText>
        </AnimatedTouchableOpacity>
        <View style={styles.row}>
          <AppButton
            onPress={() => handleScroll(-1)}
            style={[styles.skip, backButtonStyle]}
            title={'Back'}
          />
          <AppButton onPress={handleNextPress} style={styles.skip} title={buttonText} />
        </View>
      </View>
      <ExpandingDot
        data={pageData}
        expandingDotWidth={30}
        scrollX={scrollXRN}
        inActiveDotColor={Colors.themeColor30}
        activeDotColor={Colors.themeColor}
        inActiveDotOpacity={0.6}
        dotStyle={styles.dotStyle}
        containerStyle={styles.dotContainerStyle}
      />
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  width: '100%';
  background-color: ${Colors.white};
`

export const styles = StyleSheet.create({
  dotStyle: {
    width: verticalScale(10),
    height: verticalScale(10),
    borderRadius: moderateScale(5),
    marginHorizontal: scale(5)
  },
  dotContainerStyle: {
    position: 'absolute',
    marginBottom: scale(20),
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  horizontalView: {
    marginHorizontal: scale(16),
    marginBottom: scale(16),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  skip: {
    width: widthPx(15)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    columnGap: scale(10),
    alignSelf: 'flex-end',
    marginLeft: 'auto'
  }
})
