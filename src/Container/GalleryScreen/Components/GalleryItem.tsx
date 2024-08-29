import React, {memo, useState} from 'react'
import {Image, StyleSheet, TouchableOpacity} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {FasterImageView} from '@candlefinance/faster-image'
import moment from 'moment'
import styled from 'styled-components/native'

import {Colors, Fonts, Images} from '@/Theme'
import {CommonStyles} from '@/Theme/CommonStyle'
import {moderateScale, scale, verticalScale, W_HEIGHT} from '@/Theme/Responsive'

interface GalleryItemProps {
  onPress: () => void
  item: MediaType
  width: number
}

export default memo(({item, onPress, width}: GalleryItemProps) => {
  const [isError, setIsError] = useState(false)
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          width
        }
      ]}
      onPress={onPress}
    >
      {isError ? (
        <Image source={Images.placeholder} style={CommonStyles.fullView} />
      ) : (
        <FasterImageView
          style={styles.imageStyle}
          source={{
            url: item.type === 'image' ? item.media_url : item.thumbnail_url,
            cachePolicy: 'discWithCacheControl',
            allowHardware: false,
            resizeMode: 'cover'
          }}
          onError={() => setIsError(true)}
        />
      )}

      {item.type === 'video' && (
        <PlayView>
          <Image source={Images.play} />
        </PlayView>
      )}
      <LinearGradient colors={['transparent', '#000000CC']} style={styles.gradientStyle}>
        {item.caption && <CaptionText>{item.caption}</CaptionText>}
        <UploadDateText>{moment(item.date).format('MMM DD YYYY')}</UploadDateText>
      </LinearGradient>
    </TouchableOpacity>
  )
})

const CaptionText = styled.Text`
  color: ${Colors.white};
  font-size: ${moderateScale(13)}px;
  font-family: ${Fonts.ThemeMedium};
  font-weight: 500;
`

const UploadDateText = styled.Text`
  color: ${Colors.white};
  font-size: ${moderateScale(8)}px;
  font-family: ${Fonts.ThemeRegular};
  font-weight: 400;
`

const PlayView = styled.View`
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
`
const styles = StyleSheet.create({
  card: {
    ...CommonStyles.shadow,
    overflow: 'hidden',
    borderRadius: moderateScale(15),
    height: W_HEIGHT / 3,
    marginVertical: verticalScale(2.5)
  },

  imageStyle: {
    width: '100%',
    height: '100%'
  },
  gradientStyle: {
    width: '100%',
    position: 'absolute',
    paddingBottom: verticalScale(10),
    paddingLeft: scale(10),
    bottom: 0
  }
})
