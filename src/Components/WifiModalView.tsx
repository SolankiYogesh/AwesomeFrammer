import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import ReactNativeModal from 'react-native-modal'

import {Colors, Fonts} from '../Theme'
import {CommonStyles, CommonText, Separator, SeparatorH} from '../Theme/CommonStyle'
import constants from '../Theme/Constants'
import AppButton from './AppButton'
import AppScrollView from './AppScrollView'
import AppInput from './AppTextInput'
import {useDeviceOrientation} from '@/Hooks'

interface WifiModalViewProps {
  onPress: (password: string) => void
  onClose: () => void
  ssid: string
}

export default (props: WifiModalViewProps) => {
  const {t} = useTranslation()
  const {heightPx, moderateScale, ModalHeight, widthPx, isLandScape} = useDeviceOrientation()
  const {onClose = () => {}, onPress} = props
  const [isVisible, setIsVisible] = useState(true)
  const [password, setPassword] = useState('')

  return (
    <ReactNativeModal
      statusBarTranslucent
      backdropOpacity={0.4}
      animationOut={'fadeOut'}
      animationIn={'fadeIn'}
      isVisible={isVisible}
      deviceHeight={ModalHeight}
      avoidKeyboard
      onModalHide={onClose}
      animationInTiming={100}
      animationOutTiming={100}
      swipeDirection={'down'}
      onBackdropPress={() => setIsVisible(false)}
      onBackButtonPress={() => setIsVisible(false)}
      style={[CommonStyles.modalStyle, CommonStyles.centerItem]}
    >
      <AppScrollView
        contentContainerStyle={[
          styles.contianer,
          {
            width: widthPx(isLandScape ? 60 : 90),
            height: heightPx(50),
            borderRadius: moderateScale(15)
          }
        ]}
      >
        <CommonText size={18} textCenter>
          {t('S27')}
        </CommonText>
        <Separator val={3} />
        <CommonText textCenter color={Colors.subTextColor}>
          {t('S28')}
        </CommonText>
        <Separator />

        <AppInput
          returnKeyType={'done'}
          value={password}
          isPassword
          isEye
          isAnimated
          maxLength={constants.MAXLENGTH.PASSWORD}
          autoComplete={'off'}
          autoCapitalize={'none'}
          autoCorrect={false}
          spellCheck={false}
          onSubmitEditing={() => onPress(password)}
          onChangeText={setPassword}
          ContainerStyle={CommonStyles.inputStyle}
          placeholder={t('S30')}
        />
        <View style={CommonStyles.row}>
          <AppButton
            disabled={!password}
            onPress={() => onPress(password)}
            style={CommonStyles.buttonStyle}
            title={t('S29')}
          />
          <SeparatorH val={15} />
          <TouchableOpacity style={styles.skipButton} onPress={() => setIsVisible(false)}>
            <CommonText font={Fonts.ThemeSemiBold} size={15} textCenter>
              {t('S31')}
            </CommonText>
          </TouchableOpacity>
        </View>
      </AppScrollView>
    </ReactNativeModal>
  )
}

const styles = StyleSheet.create({
  contianer: {
    backgroundColor: Colors.white,
    marginTop: 'auto',
    marginBottom: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6
  },
  skipButton: {
    width: '35%'
  }
})
