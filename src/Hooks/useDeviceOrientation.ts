import {useEffect, useMemo} from 'react'
import {LayoutAnimation, StatusBar, UIManager, useWindowDimensions} from 'react-native'

import useScreenDimensions from './useScreenDimensions'

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default (): {
  isLandScape: boolean
  W_WIDTH: number
  W_HEIGHT: number
  S_WIDTH: number
  S_HEIGHT: number
  scale: (size: number) => number
  verticalScale: (size: number) => number
  moderateScale: (size: number) => number
  widthPx: (size: number) => number
  heightPx: (size: number) => number
  ModalHeight: number
} => {
  const {width: S_WIDTH, height: S_HEIGHT} = useScreenDimensions()
  const {width: W_WIDTH, height: W_HEIGHT} = useWindowDimensions()
  const isLandScape = useMemo(() => W_WIDTH >= W_HEIGHT, [W_WIDTH, W_HEIGHT])
  const [shortDimension, longDimension] =
    W_WIDTH < W_HEIGHT ? [W_WIDTH, W_HEIGHT] : [W_HEIGHT, W_WIDTH]

  useEffect(() => {
    LayoutAnimation.linear()
  }, [W_WIDTH, W_HEIGHT])

  // guideline size
  const guidelineBaseWidth = 375
  const guidelineBaseHeight = 812

  const scale = (size: number) =>
    Number(Number((shortDimension / guidelineBaseWidth) * size).toFixed())
  const verticalScale = (size: number) =>
    Number(Number((longDimension / guidelineBaseHeight) * size).toFixed())
  const moderateScale = (size: number, factor = 0.5) =>
    Number(Number(size + (scale(size) - size) * factor).toFixed())

  const getStatusBarHeight = () => StatusBar.currentHeight ?? 0

  const widthPx = (widthPercent: number) => {
    const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent)
    return (W_WIDTH * elemWidth) / 100
  }

  const heightPx = (heightPercent: number) => {
    const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent)
    return ((W_HEIGHT - Number(getStatusBarHeight().toFixed(0))) * elemHeight) / 100
  }

  const ModalHeight = useMemo(
    () => (isLandScape ? S_WIDTH : S_HEIGHT),
    [S_WIDTH, isLandScape, S_HEIGHT]
  )

  return {
    isLandScape,
    W_WIDTH,
    W_HEIGHT,
    S_WIDTH,
    S_HEIGHT,
    scale,
    verticalScale,
    moderateScale,
    widthPx,
    heightPx,
    ModalHeight
  }
}
