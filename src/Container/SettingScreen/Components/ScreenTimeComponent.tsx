import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {View} from 'react-native'
import Animated, {FadeInUp, FadeOutUp} from 'react-native-reanimated'
import {SvgXml} from 'react-native-svg'
import moment from 'moment'
import styled from 'styled-components/native'

import AwakeTimePicker from './AwakeTimePicker'
import ListTimerItem from './ListTimerItem'
import TimePickerModal from './TimePickerModal'
import RNSwitch from '@/Components/RNSwitch'
import TimeHandler from '@/Components/TimeHandler'
import {useDeviceOrientation} from '@/Hooks'
import SVGByteCode from '@/Resources/SVG/SVGByteCode'
import {Colors, Fonts, Storage} from '@/Theme'
import {CommonStyles} from '@/Theme/CommonStyle'
import constants from '@/Theme/Constants'
import {moderateScale, verticalScale} from '@/Theme/Responsive'

export default () => {
  const getIsSleep = Storage.getBoolean(constants.timerObject.SLEEP)
  const start = Storage.getNumber(constants.timerObject.START)
  const awakeTime = Storage.getNumber(constants.timerObject.AWAKE)
  const end = Storage.getNumber(constants.timerObject.END)
  const {t} = useTranslation()
  const [isAwakeModal, setIsAwakeModal] = useState(false)
  const [isSleepTime, setIsSleepTime] = useState(getIsSleep)
  const [isTimerPicker, setIsTimerPicker] = useState(false)
  const [awake, setAwake] = useState(awakeTime ?? 10)
  const [time, setTime] = useState({
    start: start ?? 0,
    end: end ?? 0
  })
  const {widthPx, isLandScape} = useDeviceOrientation()
  useEffect(() => {
    const startTime = Storage.getNumber(constants.timerObject.START)
    const endTime = Storage.getNumber(constants.timerObject.END)
    if (startTime && endTime) {
      setTime({start: startTime, end: endTime})
    }
  }, [isTimerPicker])

  useEffect(() => {
    const awake = Storage.getNumber(constants.timerObject.AWAKE)

    if (awake) {
      setAwake(awake)
    }
  }, [isAwakeModal])

  return (
    <View
      style={{
        width: widthPx(isLandScape ? 70 : 62),
        ...CommonStyles.flex
      }}
    >
      <ListTimerItem
        image={SVGByteCode.sleep()}
        title={'Sleep time'}
        tooltipText={'Set your sleep time'}
      >
        <RNSwitch
          value={isSleepTime}
          handleOnPress={(value) => {
            if (value) {
              const {awake, end, start} = TimeHandler.initializeTimer()
              setTime({
                end,
                start
              })
              setAwake(awake)
              TimeHandler.start()
            } else {
              TimeHandler.stop()
            }
            setIsSleepTime(value)
            Storage.set(constants.timerObject.SLEEP, value)
          }}
        />
      </ListTimerItem>

      {isSleepTime && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
          <ListTimerItem
            image={SVGByteCode.screen()}
            title={'Display time'}
            tooltipText={'Set your sleep time'}
          >
            <TimerView onPress={() => setIsTimerPicker(true)}>
              <TimerHintText isLandScape={isLandScape}>
                {t('S60')}
                <TimerText isLandScape={isLandScape}>
                  {moment.unix(time.start).format('hh:mm')}
                </TimerText>
              </TimerHintText>
              <TimerHintText isLandScape={isLandScape}>
                {t('S61')}
                <TimerText isLandScape={isLandScape}>
                  {moment.unix(time.end).format('hh:mm')}
                </TimerText>
              </TimerHintText>
            </TimerView>
          </ListTimerItem>
          <ListTimerItem
            image={SVGByteCode.clock()}
            title={'Temporary awake time'}
            tooltipText={
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
            }
          >
            <TimerView onPress={() => setIsAwakeModal(true)}>
              <TimerHintText isLandScape={isLandScape}>{awake + ' ' + t('S62')}</TimerHintText>
              {/* <Image source={Images.arrow} />
               */}
              <SvgXml
                width={verticalScale(18)}
                height={verticalScale(18)}
                xml={SVGByteCode.arrowsUpDown()}
              />
            </TimerView>
          </ListTimerItem>
        </Animated.View>
      )}
      {isTimerPicker && <TimePickerModal onDismiss={() => setIsTimerPicker(false)} />}
      {isAwakeModal && <AwakeTimePicker onDismiss={() => setIsAwakeModal(false)} />}
    </View>
  )
}

const TimerView = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  column-gap: 10px;
`
const TimerHintText = styled.Text<{
  isLandScape: boolean
}>`
  font-size: ${({isLandScape}) => moderateScale(!isLandScape ? 10.5 : 12.5)}px;
  font-family: ${Fonts.ThemeRegular};
  color: ${Colors.grey8a8a8a};
`
const TimerText = styled.Text<{
  isLandScape: boolean
}>`
  font-size: ${({isLandScape}) => moderateScale(!isLandScape ? 10.5 : 12.5)}px;
  font-family: ${Fonts.ThemeRegular};
  color: ${Colors.themeColor};
`
