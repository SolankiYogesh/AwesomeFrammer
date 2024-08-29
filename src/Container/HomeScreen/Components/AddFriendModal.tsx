import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import ReactNativeModal from 'react-native-modal'
import styled from 'styled-components/native'

import {Colors, Constants, Fonts, Storage} from '../../../Theme'
import {CommonStyles, CommonText, Separator} from '../../../Theme/CommonStyle'
import {moderateScale, scale, verticalScale} from '../../../Theme/Responsive'
import {useDeviceOrientation} from '@/Hooks'

interface WifiModalViewProps {
  isVisible?: boolean
  onCloseModal?: () => void
  otpCode?: string
}

const AddFriendModal = (props: WifiModalViewProps) => {
  const {isVisible, onCloseModal = () => {}} = props
  const {t} = useTranslation()
  const {ModalHeight} = useDeviceOrientation()
  const otpCode = Storage.getString(Constants.asyncStorageKeys.OTP) || ''

  return (
    <ReactNativeModal
      statusBarTranslucent
      backdropOpacity={0.4}
      animationOut={'fadeOut'}
      animationIn={'fadeIn'}
      isVisible={!!isVisible}
      animationInTiming={100}
      animationOutTiming={100}
      deviceHeight={ModalHeight}
      swipeDirection={'down'}
      onSwipeComplete={onCloseModal}
      onBackdropPress={onCloseModal}
      onBackButtonPress={onCloseModal}
      style={[CommonStyles.modalStyle, CommonStyles.centerItem]}
    >
      <View style={styles.contianer}>
        <CommonText size={17} textCenter font={Fonts.ThemeBold}>
          {t('S25')}
        </CommonText>
        <Separator val={3} />
        <CommonText textCenter color={Colors.subTextColor} size={10}>
          {t('S38')}
        </CommonText>

        <View style={styles.codeContainer}>
          {otpCode.split('').map((_: any, index: number) => {
            const emptyInput = ''
            const digit = otpCode[index] || emptyInput

            return (
              <SplitBoxes key={`box-${index.toString()}`}>
                <SplitBoxText>{digit}</SplitBoxText>
              </SplitBoxes>
            )
          })}
        </View>

        <Separator />

        <TouchableOpacity style={styles.skipButton} onPress={onCloseModal}>
          <CommonText font={Fonts.ThemeSemiBold} size={12} textCenter>
            {t('S40')}
          </CommonText>
        </TouchableOpacity>
      </View>
    </ReactNativeModal>
  )
}

export default AddFriendModal

const styles = StyleSheet.create({
  contianer: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    paddingVertical: scale(16),
    paddingHorizontal: scale(32)
  },
  skipButton: {
    width: '35%',
    paddingVertical: scale(8)
  },
  codeContainer: {
    flexDirection: 'row',
    marginVertical: scale(8)
  }
})

export const SplitBoxes = styled.View`
  border-color: ${Colors.borderColor};
  border-width: 2px;
  border-radius: 10px;
  margin: 8px;
  width: ${verticalScale(40)}px;
  height: ${verticalScale(40)}px;
  align-items: center;
  justify-content: center;
`

export const SplitBoxText = styled.Text`
  text-align: center;
  color: ${Colors.black};
  font-family: ${Fonts.ThemeBold};
  font-size: ${moderateScale(20)}px;
`
