import {type TextInput} from 'react-native'
import styled from 'styled-components/native'

import {Colors, Fonts} from '../../../Theme'
import {verticalScale} from '../../../Theme/Responsive'

export const OTPInputContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: ${verticalScale(10)}px;
`

export const TextInputHidden = styled.TextInput<{
  ref: React.RefObject<TextInput>
}>`
  position: absolute;
  opacity: 0;
`

export const SplitOTPBoxesContainer = styled.Pressable`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`
export const SplitBoxes = styled.View<{
  isFilled?: boolean
  size?: number
}>`
  border-color: ${(props) => (props.isFilled ? Colors.themeColor : Colors.borderColor)};
  border-width: 2px;
  border-radius: 10px;
  /* background-color: ${(props) => (props.isFilled ? Colors.white : Colors.borderColor30)}; */
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  align-items: center;
  justify-content: center;
`

export const SplitBoxText = styled.Text<{
  size: number
}>`
  text-align: center;
  color: ${Colors.black};
  font-family: ${Fonts.ThemeBold};
  font-size: ${({size}) => size}px;
`
