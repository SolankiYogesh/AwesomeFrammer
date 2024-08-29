import React, {useCallback, useEffect, useRef, useState} from 'react'
import {type TextInput} from 'react-native'

import {
  OTPInputContainer,
  SplitBoxes,
  SplitBoxText,
  SplitOTPBoxesContainer,
  TextInputHidden
} from './OTPInputStyle'
import {useDeviceOrientation} from '@/Hooks'

const OTPInput = ({code, setCode, maximumLength, setIsPinReady, height, keyboardType}: any) => {
  const boxArray = new Array(maximumLength).fill(0)
  const inputRef = useRef<TextInput>(null)
  const {verticalScale, moderateScale} = useDeviceOrientation()
  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false)

  const handleOnPress = useCallback(() => {
    setIsInputBoxFocused(true)
    if (inputRef.current) {
      inputRef.current?.focus()
    }
  }, [])

  const handleOnBlur = useCallback(() => {
    setIsInputBoxFocused(false)
  }, [])

  useEffect(() => {
    setIsPinReady(code.length === maximumLength)
    return () => {
      setIsPinReady(false)
    }
  }, [code, maximumLength, setIsPinReady])

  const boxDigit = useCallback(
    (_: any, index: number) => {
      const emptyInput = ''
      const digit = code[index] || emptyInput

      const isCurrentValue = index === code.length
      const isLastValue = index === maximumLength - 1
      const isCodeComplete = code.length === maximumLength

      const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete)

      return (
        <SplitBoxes
          isFilled={!!digit || (isInputBoxFocused && isValueFocused)}
          key={index}
          size={verticalScale(40)}
        >
          <SplitBoxText size={moderateScale(16)}>{digit}</SplitBoxText>
        </SplitBoxes>
      )
    },
    [code, isInputBoxFocused, maximumLength, moderateScale, verticalScale]
  )

  return (
    <OTPInputContainer>
      <SplitOTPBoxesContainer onPress={handleOnPress}>
        {boxArray.map(boxDigit)}
      </SplitOTPBoxesContainer>

      <TextInputHidden
        value={code}
        onChangeText={(text: string) =>
          setCode(keyboardType ? text.toUpperCase() : text.replace(/[^0-9]/g, ''))
        }
        maxLength={maximumLength}
        ref={inputRef}
        returnKeyType={'done'}
        keyboardType={keyboardType || 'number-pad'}
        onBlur={handleOnBlur}
        autoCapitalize={'characters'}
      />
    </OTPInputContainer>
  )
}

export default OTPInput
