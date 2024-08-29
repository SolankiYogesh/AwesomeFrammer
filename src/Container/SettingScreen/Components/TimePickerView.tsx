import React, {forwardRef, memo, useCallback, useImperativeHandle} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, View} from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import styled from 'styled-components/native'

import {useSettingTime} from './TimeProvider'
import AppInput from '@/Components/AppTextInput'
import {Colors, Fonts} from '@/Theme'
import {moderateScale, scale, verticalScale, widthPx} from '@/Theme/Responsive'

const INPUTWIDTH = widthPx(15)

interface TimePickerViewProps {
  type: 'start' | 'end'
}

export default memo(
  forwardRef<TimePickerViewRef, TimePickerViewProps>(({type}: TimePickerViewProps, ref) => {
    const {t} = useTranslation()
    const {updateValue, half, hours, minutes} = useSettingTime(type)

    const onMinuteInput = useCallback(
      (text: string) => {
        if (/^\d*$/.test(text)) {
          const num = parseInt(text, 10)

          if (text === '' || (num >= 0 && num <= 59)) {
            updateValue(type, 'minutes', text)
          }
        }
      },
      [type, updateValue]
    )

    useImperativeHandle(ref, () => ({
      getState: () => {
        if (!_.trim(hours)) {
          return
        }
        if (!_.trim(minutes)) {
          return
        }
        if (Number(hours) > 23 && Number(minutes) > 59) {
          return
        }
        return moment().hours(Number(hours)).minutes(Number(minutes)).seconds(0).unix()
      }
    }))

    const onHoursInput = useCallback(
      (text: string) => {
        if (/^\d*$/.test(text)) {
          const num = parseInt(text, 10)
          if (text === '' || (num >= 0 && num <= 23)) {
            updateValue(type, 'hours', text)
          }
        }
      },
      [type, updateValue]
    )

    return (
      <View style={styles.container}>
        <ParentRow>
          <AppInput
            value={hours}
            onChangeText={onHoursInput}
            parentStyle={{
              width: INPUTWIDTH
            }}
            style={{
              width: INPUTWIDTH / 1.5,
              height: INPUTWIDTH / 1.5,
              fontSize: moderateScale(20),
              fontFamily: Fonts.ThemeBold
            }}
            ContainerStyle={styles.inputStye}
            maxLength={2}
            textAlign={'center'}
            errorStyle={{
              fontSize: moderateScale(9),
              color: Colors.black,
              transform: [
                {
                  translateY: verticalScale(5)
                }
              ]
            }}
            error={'Hour'}
          />
          <ColumnText>{t('S58')}</ColumnText>
          <AppInput
            parentStyle={{
              width: INPUTWIDTH
            }}
            style={{
              width: INPUTWIDTH / 1.5,
              height: INPUTWIDTH / 1.5,
              fontSize: moderateScale(20),
              fontFamily: Fonts.ThemeBold
            }}
            error={'Minute'}
            errorStyle={{
              fontSize: moderateScale(9),
              color: Colors.black,
              transform: [
                {
                  translateY: verticalScale(5)
                }
              ]
            }}
            ContainerStyle={styles.inputStye}
            maxLength={2}
            textAlign={'center'}
            value={minutes}
            onChangeText={onMinuteInput}
          />
          <HalfView>
            <HalfPartView isSelected={half === 'AM'}>
              <UnitText isSelected={half === 'AM'}>{t('S56')}</UnitText>
            </HalfPartView>
            <HalfPartView isSelected={half === 'PM'}>
              <UnitText isSelected={half === 'PM'}>{t('S57')}</UnitText>
            </HalfPartView>
          </HalfView>
        </ParentRow>
      </View>
    )
  })
)
const ParentRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  column-gap: 5px;
  margin-bottom: ${verticalScale(25)}px;
`
const ColumnText = styled.Text`
  font-size: 30px;
  font-family: ${Fonts.ThemeBold};
  color: ${Colors.black};
  margin-inline: ${scale(15)}px;
`

const HalfView = styled.View`
  border-width: 2px;
  border-color: ${Colors.black};
  border-radius: ${moderateScale(5)}px;
  overflow: hidden;
  background-color: ${Colors.orangeLightFE};
`
const HalfPartView = styled.View<{
  isSelected?: boolean
}>`
  padding: ${scale(5)}px;
  background-color: ${(props: any) => (props.isSelected ? Colors.black : Colors.orangeLightFE)};
`

const UnitText = styled.Text<{
  isSelected?: boolean
}>`
  font-size: 20px;
  font-family: ${Fonts.ThemeBold};
  color: ${(props) => (props.isSelected ? Colors.white : Colors.black)};
`

const styles = StyleSheet.create({
  inputStye: {
    width: INPUTWIDTH,
    minHeight: verticalScale(60),
    backgroundColor: Colors.orangeShadeFFF
  },
  container: {
    flex: 1,
    padding: scale(20)
  }
})
