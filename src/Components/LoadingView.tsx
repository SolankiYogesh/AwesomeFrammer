import React from 'react'
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native'

import {Colors} from '@/Theme'
import {CommonStyles} from '@/Theme/CommonStyle'

export default ({style = {}}: {style?: StyleProp<ViewStyle>}) => {
  return (
    <View style={[CommonStyles.flex, CommonStyles.centerItem, style]}>
      <ActivityIndicator color={Colors.themeColor} size={'large'} />
    </View>
  )
}
