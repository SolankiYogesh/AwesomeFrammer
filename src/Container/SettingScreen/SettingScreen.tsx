import React, {useCallback, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {SvgXml} from 'react-native-svg'
import {SceneMap, TabView} from 'react-native-tab-view'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'

import {Colors, Fonts} from '../../Theme'
import {moderateScale, scale, verticalScale} from '../../Theme/Responsive'
import PrivacyComponent from './Components/PrivacyComponent'
import ScreenTimeComponent from './Components/ScreenTimeComponent'
import SettingContent from './Components/SettingContent'
import TNCComponent from './Components/TNCComponent'
import WifiComponent from './Components/WifiComponent'
import AppHeader from '@/Components/AppHeader'
import {useDeviceOrientation} from '@/Hooks'
import KIOSK from '@/Modules/KIOSKMode'
import SVGByteCode from '@/Resources/SVG/SVGByteCode'
import {CommonStyles} from '@/Theme/CommonStyle'

const renderScene = SceneMap({
  setting: SettingContent,
  wifi: WifiComponent,
  general: ScreenTimeComponent,
  tnc: TNCComponent,
  privacy: PrivacyComponent
})

const getImage = (key: string, isActive: boolean) => {
  switch (key) {
    case 'setting':
      return SVGByteCode.info(isActive ? Colors.white : Colors.black)
    case 'wifi':
      return SVGByteCode.wifi(isActive ? Colors.white : Colors.black)

    case 'general':
      return SVGByteCode.setting(isActive ? Colors.white : Colors.black)
    case 'tnc':
      return SVGByteCode.tnc(isActive ? Colors.white : Colors.black)
    case 'privacy':
      return SVGByteCode.privacy(isActive ? Colors.white : Colors.black)

    default:
      return SVGByteCode.wifi(isActive ? Colors.white : Colors.black)
  }
}

export default () => {
  const {W_WIDTH, widthPx, W_HEIGHT, isLandScape} = useDeviceOrientation()
  const [index, setIndex] = useState(0)
  const {t} = useTranslation()
  const [routes] = useState([
    {key: 'wifi', title: 'Wifi'},
    {key: 'setting', title: 'App Info'},
    {key: 'general', title: 'General Setting'},
    {key: 'tnc', title: 'Terms & Condition'},
    {key: 'privacy', title: 'Privacy Policy'}
  ])

  const renderTabBar = useCallback(() => {
    return (
      <View
        style={[
          styles.tabBar,
          {
            width: widthPx(isLandScape ? 30 : 38)
          }
        ]}
      >
        {routes.map((route, i) => {
          const activeIndex = index === i

          return (
            <TouchableOpacity
              key={route.key}
              style={[
                styles.itemContainer,
                {
                  backgroundColor: activeIndex ? Colors.themeSecondary : Colors.transparent
                }
              ]}
              onPress={() => setIndex(i)}
            >
              <SvgXml
                width={verticalScale(20)}
                height={verticalScale(20)}
                xml={getImage(route.key, activeIndex)}
              />

              <Text style={[styles.text, {color: activeIndex ? Colors.white : Colors.black}]}>
                {route.title}
              </Text>
            </TouchableOpacity>
          )
        })}

        <TouchableOpacity
          style={[
            styles.itemContainer,
            {
              backgroundColor: Colors.transparent
            }
          ]}
          onPress={() => KIOSK.remove()}
        >
          <IoniconsIcon name={'close-circle-outline'} size={24} color={Colors.black} />
          <Text style={[styles.text, {color: Colors.black}]}>{'Normal Mode'}</Text>
        </TouchableOpacity>
      </View>
    )
  }, [index, isLandScape, routes, widthPx])

  return (
    <View style={CommonStyles.flex}>
      <AppHeader title={t('S23')} />
      <View
        style={[
          styles.container,
          {
            width: W_WIDTH,
            height: W_HEIGHT
          }
        ]}
      >
        {renderTabBar()}
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          swipeEnabled={false}
          renderTabBar={() => null}
          initialLayout={{width: widthPx(70)}}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.ThemeRegular,
    fontWeight: '400',
    fontSize: moderateScale(12),
    color: Colors.black,
    marginLeft: scale(8)
  },

  itemContainer: {
    padding: scale(5),
    flexDirection: 'row',
    backgroundColor: Colors.themeSecondary,
    borderRadius: moderateScale(5),
    alignItems: 'center'
  },
  tabBar: {
    backgroundColor: Colors.menuBackground,
    borderRightWidth: 1,
    borderRightColor: Colors.borderColor,
    padding: scale(10)
  },
  container: {
    flexDirection: 'row'
  }
})
