import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Image} from 'react-native'
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel'
import {styled} from 'styled-components/native'

import {Colors, Fonts, Images, Screens} from '../../Theme'
import {AppContainer, CommonStyles, CommonText, Separator} from '../../Theme/CommonStyle'
import MediaItem from './Components/MediaItem'
import TopToolBarView from './Components/TopToolBarView'
import VideoPlay from './Components/VideoPlay'
import {useDeviceOrientation, useMedia, useRoute, useStateRef} from '@/Hooks'
import {scale} from '@/Theme/Responsive'

export default () => {
  const {t} = useTranslation()
  const swipeFlatListRef = useRef<ICarouselInstance>(null)
  const [currentFrameIndex, setCurrentFrameIndex] = useStateRef(0)
  const params = useRoute<Screens.HomeScreen>()?.params
  const initialIndex = params?.initialIndex ?? 0
  const {S_WIDTH, S_HEIGHT} = useDeviceOrientation()
  const [isAuto, setIsAuto] = useState(true)

  const fullViewStyle = useMemo(
    () => ({
      height: S_HEIGHT,
      width: S_WIDTH
    }),
    [S_HEIGHT, S_WIDTH]
  )

  const {posts} = useMedia()

  useEffect(() => {
    if (posts?.length > 0) {
      swipeFlatListRef.current?.scrollTo({
        animated: true,
        index: initialIndex
      })
      setCurrentFrameIndex(initialIndex)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIndex])

  const renderItem = useCallback(
    ({item, index}: {item: MediaType; index: number}) => {
      switch (item.type) {
        case 'image':
          return <MediaItem item={item} />

        case 'video':
          return (
            <VideoPlay
              onLoadVideo={() => setIsAuto(false)}
              item={item}
              onVideoEnd={() => setIsAuto(true)}
              isFocus={currentFrameIndex === index}
            />
          )

        default:
          return <></>
      }
    },
    [currentFrameIndex]
  )

  const renderEmpty = useMemo(() => {
    return (
      <MainViewContainer>
        <ImageView>
          <Image source={Images.emptyFrame} style={CommonStyles.fullView} resizeMode={'cover'} />
        </ImageView>
        <Separator val={16} />
        <CommonText size={30} font={Fonts.ThemeSemiBold} color={Colors.themeColor} textCenter>
          {t('S21')}
        </CommonText>
        <CommonText size={15} textCenter>
          {t('S22')}
        </CommonText>
      </MainViewContainer>
    )
  }, [t])

  return (
    <AppContainer noPadding style={fullViewStyle}>
      <MainViewContainer style={fullViewStyle}>
        <TopToolBarView />

        {posts?.length > 0 ? (
          <Carousel
            loop
            ref={swipeFlatListRef}
            vertical={false}
            width={S_WIDTH}
            height={S_HEIGHT}
            autoPlay={isAuto}
            defaultIndex={0}
            autoPlayInterval={5000}
            data={posts}
            snapEnabled
            pagingEnabled
            onSnapToItem={setCurrentFrameIndex}
            renderItem={renderItem}
          />
        ) : (
          renderEmpty
        )}
      </MainViewContainer>
    </AppContainer>
  )
}

const ImageView = styled.View`
  width: ${scale(245)}px;
  height: ${scale(215)}px;
`

const MainViewContainer = styled.View`
  justify-content: center;
  align-items: center;
`
