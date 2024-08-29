import {Dimensions, StatusBar} from 'react-native'

const {height: W_HEIGHT, width: W_WIDTH} = Dimensions.get('window')
const {height: S_HEIGHT, width: S_WIDTH} = Dimensions.get('screen')

const widthPx = (widthPercent: number) => {
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent)
  return (W_WIDTH * elemWidth) / 100
}

const heightPx = (heightPercent: number) => {
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent)
  return ((W_HEIGHT - Number(getStatusBarHeight().toFixed(0))) * elemHeight) / 100
}

const getStatusBarHeight = () => StatusBar.currentHeight ?? 0

const [shortDimension, longDimension] =
  W_WIDTH < W_HEIGHT ? [W_WIDTH, W_HEIGHT] : [W_HEIGHT, W_WIDTH]

// guideline size
const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

const scale = (size: number) =>
  Number(Number((shortDimension / guidelineBaseWidth) * size).toFixed())
const verticalScale = (size: number) =>
  Number(Number((longDimension / guidelineBaseHeight) * size).toFixed())
const moderateScale = (size: number, factor = 0.5) =>
  Number(Number(size + (scale(size) - size) * factor).toFixed())

const INPUT_HEIGHT = verticalScale(35)
const VIEW_RADIUS = moderateScale(8)
const MAX_INPUT_HEIGHT = verticalScale(90)
const STATUSBAR_HEIGHT = getStatusBarHeight()

export {
  getStatusBarHeight,
  heightPx,
  INPUT_HEIGHT,
  MAX_INPUT_HEIGHT,
  moderateScale,
  S_HEIGHT,
  S_WIDTH,
  scale,
  STATUSBAR_HEIGHT,
  verticalScale,
  VIEW_RADIUS,
  W_HEIGHT,
  W_WIDTH,
  widthPx
}
