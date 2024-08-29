import React, {forwardRef, useImperativeHandle, useRef} from 'react'
import {ActivityIndicator, Dimensions, StyleSheet, View} from 'react-native'

import {Colors} from '@/Theme'
import {CommonStyles} from '@/Theme/CommonStyle'
import {moderateScale, verticalScale} from '@/Theme/Responsive'

const {width, height} = Dimensions.get('screen')

const AppLoader = forwardRef<AppLoaderRefType>((_, ref) => {
  const viewRef = useRef<View>(null)

  useImperativeHandle(ref, () => ({
    showLoader(state: boolean) {
      viewRef.current?.setNativeProps({
        style: {
          display: state ? 'flex' : 'none'
        }
      })
    }
  }))

  return (
    <View ref={viewRef} style={styles.modalContainer}>
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={Colors.themeColor} />
      </View>
    </View>
  )
})

export default AppLoader

const styles = StyleSheet.create({
  container: {
    width: verticalScale(100),
    height: verticalScale(100),
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
    elevation: 6
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.blackColor30,
    ...CommonStyles.centerItem,
    width,
    height,
    display: 'none',
    zIndex: 9999999
  }
})
