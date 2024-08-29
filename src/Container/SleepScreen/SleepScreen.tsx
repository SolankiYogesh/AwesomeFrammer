import React, {useCallback} from 'react'
import moment from 'moment'
import styled from 'styled-components/native'

import TimeHandler from '@/Components/TimeHandler'
import useTime from '@/Hooks/useTime'
import {Colors, Fonts} from '@/Theme'
import {moderateScale} from '@/Theme/Responsive'

export default () => {
  const time = useTime()

  const onDoubleTap = useCallback(() => {
    TimeHandler.startAwakeTimer()
  }, [])

  return (
    <Container onPress={onDoubleTap}>
      <ParentView>
        <TimerView>
          <TimeText>{moment(time).format('HH:mm')}</TimeText>
          <HalfText>{moment(time).format('A')}</HalfText>
        </TimerView>
        <DateText>{moment(time).format('ddd, D MMMM YYYY')}</DateText>
      </ParentView>
    </Container>
  )
}

const Container = styled.Pressable`
  background-color: ${Colors.black};
  flex: 1;
  align-items: center;
  justify-content: center;
`

const ParentView = styled.View``
const TimerView = styled.View`
  flex-direction: row;
  align-items: baseline;
  column-gap: 10px;
`
const TimeText = styled.Text`
  color: ${Colors.white};
  font-size: ${moderateScale(50)}px;
  font-family: ${Fonts.ThemeSemiBold};
`
const HalfText = styled.Text`
  color: ${Colors.white};
  font-size: ${moderateScale(15)}px;
  font-family: ${Fonts.ThemeSemiBold};
`
const DateText = styled.Text`
  color: ${Colors.white};
  font-family: ${Fonts.ThemeSemiBold};
  font-size: ${moderateScale(15)}px;
  text-align: center;
`
