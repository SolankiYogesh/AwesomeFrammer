import React, {useCallback, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet} from 'react-native'
import ReactNativeModal from 'react-native-modal'
import _ from 'lodash'
import styled from 'styled-components/native'

import {AppScrollView, AppTextInput} from '@/Components'
import {useDeviceOrientation} from '@/Hooks'
import {Colors, Fonts, Storage} from '@/Theme'
import constants from '@/Theme/Constants'
import {moderateScale, scale, verticalScale, widthPx} from '@/Theme/Responsive'

interface TimePickerModalProps {
  onDismiss: () => void
}
const INPUTWIDTH = widthPx(15)
const INDIACATOR_WITH = widthPx(50) / 2

export default ({onDismiss}: TimePickerModalProps) => {
  const time = Storage.getNumber(constants.timerObject.AWAKE)?.toString()
  const [visible, setVisible] = useState(true)
  const [awakeTime, setAwakeTime] = useState(time ?? '0')
  const {t} = useTranslation()
  const {ModalHeight, widthPx, isLandScape} = useDeviceOrientation()
  const onPressSubmit = useCallback(() => {
    if (!_.trim(awakeTime)) {
      return
    }
    if (Number(awakeTime) > 59) {
      return
    }

    Storage.set(constants.timerObject.AWAKE, Number(awakeTime))

    setVisible(false)
  }, [awakeTime])

  const onMinuteInput = useCallback((text: string) => {
    if (/^\d*$/.test(text)) {
      const num = parseInt(text, 10)
      if (text === '' || (num >= 0 && num <= 59)) {
        setAwakeTime(text)
      }
    }
  }, [])

  return (
    <ReactNativeModal
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      isVisible={visible}
      onModalHide={onDismiss}
      deviceHeight={ModalHeight}
    >
      <AppScrollView
        contentContainerStyle={[
          styles.contentContainerStyle,
          {
            width: widthPx(isLandScape ? 70 : 80)
          }
        ]}
      >
        <Container>
          <TopView>
            <LabelText>{t('S49')}</LabelText>
            <HintText>{t('S28')}</HintText>
          </TopView>
          <IndicatorView />
          <ParentRow>
            <AppTextInput
              value={awakeTime}
              onChangeText={onMinuteInput}
              ContainerStyle={styles.inputStye}
              parentStyle={{
                width: INPUTWIDTH
              }}
              style={{
                width: INPUTWIDTH / 1.5,
                height: INPUTWIDTH / 1.5,
                fontSize: moderateScale(20),
                fontFamily: Fonts.ThemeBold
              }}
              error={'Minutes'}
              errorStyle={{
                fontSize: moderateScale(9),
                color: Colors.black,
                transform: [
                  {
                    translateY: verticalScale(5)
                  }
                ]
              }}
              maxLength={2}
              textAlign={'center'}
            />
          </ParentRow>
          <ButtonRowView>
            <Button onPress={onPressSubmit} isOk>
              <ButtonText isOk>{t('S40')}</ButtonText>
            </Button>
            <Button onPress={() => setVisible(false)}>
              <ButtonText>{t('S59')}</ButtonText>
            </Button>
          </ButtonRowView>
        </Container>
      </AppScrollView>
    </ReactNativeModal>
  )
}
const Container = styled.View`
  background-color: ${Colors.white};
  border-radius: ${moderateScale(13)}px;
  row-gap: 10px;
  width: ${widthPx(50)}px;
  align-self: center;
  overflow: hidden;
  padding: 20px;
`
const LabelText = styled.Text`
  font-size: ${moderateScale(12.5)}px;
  font-family: ${Fonts.ThemeExtraBold};
  color: ${Colors.black};
  text-align: center;
`
const HintText = styled.Text`
  font-size: ${moderateScale(10)}px;
  font-family: ${Fonts.ThemeMedium};
  color: ${Colors.black};
  text-align: center;
`

const IndicatorView = styled.View`
  width: ${INDIACATOR_WITH * 2}px;
  height: ${verticalScale(1.5)}px;
  background-color: ${Colors.borderColor};
  margin-top: ${verticalScale(10)}px;
`
const TopView = styled.View`
  padding: ${scale(20)}px;
  row-gap: 10px;
`
const ParentRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  column-gap: 15px;
  margin-bottom: ${verticalScale(25)}px;
`

const Button = styled.TouchableOpacity<{
  isOk?: boolean
}>`
  height: 60px;
  width: 45%;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isOk ? Colors.blackShade0F : Colors.white)};
  border-radius: ${moderateScale(10)}px;
  margin-bottom: ${verticalScale(20)}px;
`

const ButtonText = styled.Text<{
  isOk?: boolean
}>`
  font-size: 20px;
  font-family: ${Fonts.ThemeBold};
  color: ${(props) => (!props.isOk ? Colors.blackShade0F : Colors.white)};
`

const ButtonRowView = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: center;
`
const styles = StyleSheet.create({
  inputStye: {
    width: INPUTWIDTH,
    minHeight: verticalScale(60),
    backgroundColor: Colors.orangeShadeFFF
  },
  contentContainerStyle: {
    margin: 'auto',

    borderRadius: moderateScale(12),
    overflow: 'hidden'
  }
})
