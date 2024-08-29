import React, {useCallback, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, View} from 'react-native'
import ReactNativeModal from 'react-native-modal'
import {SceneMap, TabBar, TabView} from 'react-native-tab-view'
import styled from 'styled-components/native'

import TimePickerView from './TimePickerView'
import TimeProvider from './TimeProvider'
import {AppScrollView, TimeHandler} from '@/Components'
import {useDeviceOrientation} from '@/Hooks'
import {Colors, Constants, Fonts, Storage} from '@/Theme'
import {heightPx, moderateScale, scale, verticalScale} from '@/Theme/Responsive'

interface TimePickerModalProps {
  onDismiss: () => void
}

export default ({onDismiss}: TimePickerModalProps) => {
  const [visible, setVisible] = useState(true)
  const startRef = useRef<TimePickerViewRef>(null)
  const endRef = useRef<TimePickerViewRef>(null)
  const {ModalHeight, widthPx, isLandScape} = useDeviceOrientation()
  const {t} = useTranslation()
  const [routes] = useState([
    {key: 'start', title: 'Start Time'},
    {key: 'end', title: 'End Time'}
  ])
  const [index, setIndex] = useState(0)

  const renderScene = SceneMap({
    start: () => <TimePickerView type={'start'} ref={startRef} />,
    end: () => <TimePickerView type={'end'} ref={endRef} />
  })

  const onPressSubmit = useCallback(() => {
    if (startRef.current) {
      const start = startRef.current.getState()
      if (start) {
        Storage.set(Constants.timerObject.START, start)
      }
    }
    if (endRef.current) {
      const end = endRef.current.getState()
      if (end) {
        Storage.set(Constants.timerObject.END, end)
      }
    }
    TimeHandler.start()
    onDismiss()
  }, [onDismiss])

  return (
    <ReactNativeModal
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      isVisible={visible}
      deviceHeight={ModalHeight}
      onModalHide={onDismiss}
    >
      <AppScrollView
        contentContainerStyle={[
          styles.contentContainerStyle,
          {
            width: widthPx(isLandScape ? 55 : 80)
          }
        ]}
      >
        <Container>
          <TopView>
            <LabelText>{t('S49')}</LabelText>
            <HintText>{t('S28')}</HintText>
          </TopView>
          <TimeProvider>
            <View style={styles.tabContainer}>
              <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                swipeEnabled={false}
                renderTabBar={(props) => (
                  <TabBar
                    {...props}
                    indicatorStyle={{backgroundColor: Colors.themeColor}}
                    style={styles.tabStyle}
                    labelStyle={styles.labelStyle}
                  />
                )}
                initialLayout={{width: widthPx(70), height: heightPx(70)}}
              />
              <ButtonRowView>
                <Button onPress={onPressSubmit} isOk>
                  <ButtonText isOk>{t('S40')}</ButtonText>
                </Button>
                <Button onPress={onDismiss}>
                  <ButtonText>{t('S59')}</ButtonText>
                </Button>
              </ButtonRowView>
            </View>
          </TimeProvider>
        </Container>
      </AppScrollView>
    </ReactNativeModal>
  )
}

const ButtonRowView = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: center;
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
`

const ButtonText = styled.Text<{
  isOk?: boolean
}>`
  font-size: 20px;
  font-family: ${Fonts.ThemeMedium};
  color: ${(props) => (!props.isOk ? Colors.blackShade0F : Colors.white)};
`

const styles = StyleSheet.create({
  labelStyle: {
    color: Colors.black,
    textTransform: 'capitalize',
    fontSize: moderateScale(12.5),
    fontFamily: Fonts.ThemeBold
  },
  tabStyle: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5
  },
  tabContainer: {
    borderRadius: moderateScale(12)
  },
  contentContainerStyle: {
    margin: 'auto',
    borderRadius: moderateScale(12),
    overflow: 'hidden'
  }
})

const Container = styled.View`
  background-color: ${Colors.white};
  border-radius: ${moderateScale(13)}px;
  row-gap: 20px;
  width: 100%;
  height: 100%;
  align-self: center;
  overflow: hidden;
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

const TopView = styled.View`
  padding: ${scale(20)}px;
  row-gap: 10px;
`
