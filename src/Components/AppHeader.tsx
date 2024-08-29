import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'

import {useDeviceOrientation, useNavigation} from '@/Hooks'
import {Colors, Fonts} from '@/Theme'
import {moderateScale, scale, verticalScale} from '@/Theme/Responsive'

interface AppHeaderProps {
  title: string
}

export default ({title}: AppHeaderProps) => {
  const navigation = useNavigation()
  const {S_WIDTH} = useDeviceOrientation()
  return (
    <View
      style={[
        styles.toolBarContainer,
        {
          width: S_WIDTH
        }
      ]}
    >
      <TouchableOpacity style={styles.raw} onPress={() => navigation.goBack()}>
        <IoniconsIcon
          name={'chevron-back-outline'}
          size={verticalScale(30)}
          color={Colors.subTextColor}
        />
      </TouchableOpacity>
      <Text style={styles.titleStyle}>{title}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: Fonts.ThemeBold,
    fontWeight: '600',
    fontSize: moderateScale(18.5),
    color: Colors.black,
    textAlign: 'center',
    width: '100%',
    position: 'absolute',
    zIndex: -1
  },
  toolBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: verticalScale(55),
    borderBottomWidth: 1,
    borderBlockColor: Colors.blackColor30
  },
  raw: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(10)
  }
})
