import React, {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {
  Image,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle
} from 'react-native'
import _ from 'lodash'
import styled from 'styled-components/native'

import AnimatedPlaceHolder from './AnimatedPlaceHolder'
import {Colors, Fonts, Images} from '@/Theme'
import {heightPx, INPUT_HEIGHT, moderateScale, scale, verticalScale} from '@/Theme/Responsive'

export interface AppInputProps extends TextInputProps {
  placeholder?: string
  onChangeText?: (text: string) => void
  value?: string
  ContainerStyle?: StyleProp<ViewStyle>
  isPassword?: boolean
  isMultiline?: boolean
  rightImage?: ImageSourcePropType
  leftImage?: ImageSourcePropType
  leftImageStyle?: StyleProp<ImageStyle>
  onPress?: () => void
  editable?: boolean
  isEye?: boolean
  error?: string
  errorStyle?: StyleProp<TextStyle>
  isAnimated?: boolean
  blurOnSubmit?: boolean
  parentStyle?: StyleProp<ViewStyle>
  onFocusChange?: (focus: boolean) => void
  rightImageStyle?: StyleProp<ViewStyle>
}

const AppInput = forwardRef<TextInput, AppInputProps>((props: AppInputProps, ref) => {
  const {
    placeholder = '',
    isMultiline = false,
    onChangeText = () => {},
    value = '',
    ContainerStyle = {},
    rightImage,
    onPress,
    editable = true,
    isEye = false,
    error = '',
    errorStyle = {},
    isAnimated = false,
    blurOnSubmit = false,
    leftImage,
    leftImageStyle = {},
    parentStyle = {},
    onFocusChange = () => {},
    rightImageStyle = {}
  } = props

  const [isPassword, setIsPassword] = useState(false)
  const [isFocus, setISFocus] = useState(false)

  const textInputRef = useRef<TextInput>()
  const isError = useMemo(() => !!_.trim(error), [error])

  useEffect(() => {
    if (props.isPassword) {
      setIsPassword(true)
    }
  }, [props.isPassword])

  const setRefs = useCallback(
    (node: TextInput) => {
      if (ref) {
        ref.current = node
      }
      textInputRef.current = node
    },
    [ref]
  )

  return (
    <TouchableOpacity
      style={[styles.parentStyle, parentStyle]}
      disabled={!onPress}
      onPress={onPress}
    >
      <View
        style={[
          styles.inputContainer,
          isFocus && styles.activeContainer,
          isMultiline && styles.multiStyle,
          value !== '' && styles.activeContainer,
          ContainerStyle,
          isError && styles.errorContainer
        ]}
      >
        {leftImage && (
          <View style={styles.imageContainer}>
            <Image style={[styles.imageStyle, leftImageStyle]} source={leftImage} />
          </View>
        )}
        <TextInput
          onChangeText={onChangeText}
          value={value}
          ref={setRefs}
          onFocus={() => {
            setISFocus(true)
            if (onFocusChange) {
              onFocusChange(true)
            }
          }}
          onBlur={() => {
            setISFocus(false)
            if (onFocusChange) {
              onFocusChange(false)
            }
          }}
          editable={editable}
          blurOnSubmit={blurOnSubmit}
          multiline={isMultiline}
          placeholderTextColor={Colors.borderColor}
          selectionColor={Colors.themeColor}
          style={[
            styles.input,
            isMultiline && styles.multiStyle,
            isAnimated && styles.animatedInput
          ]}
          {...{...props, placeholder: isAnimated ? '' : placeholder}}
          secureTextEntry={isPassword}
        />

        {isAnimated && (
          <AnimatedPlaceHolder
            isError={isError}
            onFocus={() => {
              if (textInputRef.current) {
                textInputRef.current?.focus()
              }
            }}
            placeholder={placeholder}
            isFocus={!!_.trim(value) || isFocus}
          />
        )}

        {rightImage && (
          <View style={[styles.imageContainer, rightImageStyle]}>
            <Image style={styles.imageStyle} source={rightImage} />
          </View>
        )}
        {props?.isPassword && isEye && (
          <EyeContainer
            style={(isAnimated && styles.animatedEye) || {}}
            onPress={() => {
              setIsPassword(!isPassword)
            }}
          >
            <EyeImage
              style={tint}
              tintColor={Colors.greyShadeA0}
              source={isPassword ? Images.eye : Images.hideEye}
            />
          </EyeContainer>
        )}
      </View>
      {isError && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </TouchableOpacity>
  )
})

export default AppInput

const styles = StyleSheet.create({
  inputContainer: {
    height: verticalScale(40),
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.borderColor,
    borderRadius: moderateScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    zIndex: 0
  },
  errorContainer: {
    borderColor: Colors.redShadeD3,
    borderWidth: 1
  },
  parentStyle: {
    width: scale(300),
    marginVertical: verticalScale(12),
    justifyContent: 'center'
  },
  activeContainer: {
    borderColor: Colors.themeColor,
    backgroundColor: Colors.white,
    zIndex: 0
  },
  imageContainer: {
    width: verticalScale(25),
    height: verticalScale(25),
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageStyle: {
    width: '70%',
    height: '70%'
  },
  input: {
    fontSize: moderateScale(16),
    color: Colors.buttonBackGround,
    fontFamily: Fonts.ThemeRegular,
    fontWeight: '500',
    flex: 1,
    height: INPUT_HEIGHT,
    zIndex: 0
  },
  animatedInput: {
    position: 'absolute',
    left: scale(10),
    flex: 1,
    width: '100%'
  },
  multiStyle: {
    height: heightPx(40),
    textAlignVertical: 'top',
    paddingTop: verticalScale(15),
    zIndex: 0
  },

  animatedEye: {
    position: 'absolute',
    right: scale(10)
  },
  errorText: {
    marginLeft: scale(5),
    marginVertical: scale(5),
    position: 'absolute',
    bottom: -verticalScale(20),
    fontSize: moderateScale(12),
    fontFamily: Fonts.ThemeMedium,
    color: Colors.redShadeD3
  }
})

const EyeContainer = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
`

const EyeImage = styled.Image`
  width: 90%;
  height: 90%;
`
const tint = {
  tintColor: Colors.borderColor
}
