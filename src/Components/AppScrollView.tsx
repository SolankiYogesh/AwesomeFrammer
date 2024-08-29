import React from 'react'
import {type StyleProp, type ViewStyle} from 'react-native'
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps
} from 'react-native-keyboard-aware-scroll-view'

interface AppScrollViewProps extends KeyboardAwareScrollViewProps {
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  stickyHeaderIndices?: number[]
  customExtraScrollHeight?: number
}

export default (props: AppScrollViewProps) => {
  const {
    children,
    stickyHeaderIndices,
    style,
    contentContainerStyle = {},
    customExtraScrollHeight
  } = props
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'handled'}
      contentContainerStyle={contentContainerStyle}
      style={style}
      bounces={false}
      extraHeight={45}
      extraScrollHeight={customExtraScrollHeight ?? 10}
      stickyHeaderIndices={stickyHeaderIndices}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  )
}
