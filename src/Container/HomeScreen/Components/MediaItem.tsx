import React, {memo, useMemo, useState} from 'react'
import {Image, StyleSheet, View} from 'react-native'
import {FasterImageView} from '@candlefinance/faster-image'

import {useDeviceOrientation} from '@/Hooks'
import {Colors, Fonts, Images} from '@/Theme'
import {CommonStyles, CommonText} from '@/Theme/CommonStyle'

interface MediaItemTypes {
  item: MediaType
  isVideoThumbnail?: boolean
}

export default memo(({item, isVideoThumbnail = false}: MediaItemTypes) => {
  const [isError, setIsError] = useState(false)
  const {S_HEIGHT, S_WIDTH} = useDeviceOrientation()
  const fullViewStyle = useMemo(
    () => ({
      height: S_HEIGHT,
      width: S_WIDTH
    }),
    [S_HEIGHT, S_WIDTH]
  )
  return (
    <View key={item.id} style={fullViewStyle}>
      {isError ? (
        <Image resizeMode={'cover'} source={Images.placeholder} style={fullViewStyle} />
      ) : (
        <React.Fragment>
          <FasterImageView
            source={{
              url: isVideoThumbnail ? item.thumbnail_url : item.media_url,
              cachePolicy: 'discWithCacheControl',
              resizeMode: 'fill',
              allowHardware: false,
              blurRadius: 10
            }}
            style={[StyleSheet.absoluteFillObject, fullViewStyle]}
          />

          <FasterImageView
            source={{
              url: isVideoThumbnail ? item.thumbnail_url : item.media_url,
              cachePolicy: 'discWithCacheControl',
              allowHardware: false
            }}
            onError={() => setIsError(true)}
            style={fullViewStyle}
          />

          {isVideoThumbnail && (
            <View style={CommonStyles.captionStyle}>
              <CommonText size={30} font={Fonts.ThemeSemiBold} color={Colors.white}>
                {item?.caption}
              </CommonText>
            </View>
          )}
        </React.Fragment>
      )}
    </View>
  )
})
