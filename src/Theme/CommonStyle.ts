import {StyleSheet, TextProps} from 'react-native'
import styled from 'styled-components/native'

import Colors from './Colors'
import Fonts from './Fonts'
import {moderateScale, scale, verticalScale} from './Responsive'

export const CommonStyles = StyleSheet.create({
  flex: {
    flex: 1
  },
  inputStyle: {
    width: '100%'
  },
  centerItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalStyle: {
    padding: 0,
    margin: 0,
    flex: 1,
    width: '100%',
    height: '100%'
  },

  fullView: {
    width: '100%',
    height: '100%'
  },

  captionStyle: {
    position: 'absolute',
    bottom: 20
  },
  flexGrow: {
    flexGrow: 1
  },
  buttonStyle: {
    width: '35%',
    alignSelf: 'flex-end'
  },
  shadow: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Colors.white
  },
  selfCenter: {
    alignSelf: 'center'
  }
})

export const Separator = styled.View<{
  val?: number
}>`
  width: 100%;
  margin-vertical: ${(props: any) => verticalScale(props?.val || 5)}px;
`

interface CommonTextProps extends TextProps {
  color?: string
  font?: string
  size?: number
  fontWeight?: number
  textCenter?: boolean
  letterSpacing?: number
}
export const CommonText = styled.Text<CommonTextProps>`
  font-family: ${(props: any) => props?.font || Fonts.ThemeMedium};
  color: ${(props: any) => props?.color || Colors.buttonBackGround};
  font-size: ${(props: any) => props?.size ?? moderateScale(12)}px;
  ${(props: any) => props?.textCenter && `text-align: center`};
  ${(props: any) => props?.letterSpacing && `letter-spacing: ${props?.letterSpacing}`};
`
export const SeparatorH = styled.View<{
  val?: number
}>`
  height: 100%;
  margin-horizontal: ${(props: any) => scale(props?.val || 5)}px;
`
export const AppContainer = styled.View<{
  noPadding?: boolean
}>`
  flex: 1;
  background-color: ${Colors.white};
  padding-horizontal: ${(props: any) => verticalScale(props?.noPadding ? 0 : 20)}px;
`
