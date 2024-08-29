import React, {memo, useCallback, useEffect, useRef, useState} from 'react'
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Slider} from 'react-native-awesome-slider'
import {useSharedValue, withTiming} from 'react-native-reanimated'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Video, {type OnLoadData, VideoRef} from 'react-native-video'
import convert from 'react-native-video-cache'
import {useIsFocused} from '@react-navigation/native'
import styled from 'styled-components/native'

import {Colors, Fonts} from '../../../Theme'
import MediaItem from './MediaItem'
import {S_HEIGHT, scale, W_WIDTH} from '@/Theme/Responsive'

interface VideoPlayProps {
  onVideoEnd: () => void
  isFocus: boolean
  item: MediaType
  onLoadVideo: () => void
}

const getPercentage = (value: number, duration: number) => {
  const progress = (value / duration) * 100
  return Number.isNaN(progress) || !Number.isFinite(progress) ? 0 : progress
}

const VideoPlay = ({item, onVideoEnd, isFocus, onLoadVideo}: VideoPlayProps) => {
  const [pause, setPause] = useState(true)
  const [loading, setLoading] = useState(false)
  const [playerState, setPlayerState] = useState({
    duration: 0,
    current: 0
  })
  const playerRef = useRef<VideoRef>(null)

  const progress = useSharedValue(0)
  const min = useSharedValue(0)
  const max = useSharedValue(100)
  const isFocused = useIsFocused()

  const onLoad = (data: OnLoadData) => {
    setLoading(false)
    if (data?.duration) {
      setPlayerState((state) => ({
        ...state,
        duration: data.duration
      }))
    }
  }

  const onLoadStart = () => setLoading(true)

  const onEnd = () => {
    setPause(true)
    playerRef.current?.seek(0)
    onVideoEnd()
    progress.value = withTiming(0)
  }

  const toMMSS = (s: number) => {
    const secNum = parseInt(s.toString(), 10)
    const hours = Math.floor(secNum / 3600)
    let minutes: any = Math.floor((secNum - hours * 3600) / 60)
    let seconds: any = secNum - hours * 3600 - minutes * 60

    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    if (seconds < 10) {
      seconds = `0${seconds}`
    }
    return `${minutes}:${seconds}`
  }

  const onSeek = useCallback(
    (seek: number) => {
      try {
        setPause(false)
        if (playerRef?.current && playerRef?.current !== null) {
          playerRef?.current?.seek(seek)
        }
        progress.value = seek
      } catch (err) {}
    },
    [progress]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onLoadVideo(), [])

  useEffect(() => {
    if (!isFocused) {
      setPause(true)
    }
  }, [isFocused])

  useEffect(() => {
    if (isFocus) {
      if (isFocused) {
        onSeek(0)
      }
    } else {
      setPause(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocus, isFocused])

  return (
    <ScreenView>
      <Video
        ref={playerRef}
        style={styles.videoStyle}
        source={{uri: convert(item.media_url)}}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        onEnd={onEnd}
        onError={() => onVideoEnd()}
        onProgress={(event) => {
          const current = getPercentage(event.currentTime, event.seekableDuration)

          progress.value = withTiming(current)

          setPlayerState((state) => ({
            ...state,
            current: event.currentTime
          }))
        }}
        controls={false}
        renderPoster={<MediaItem isVideoThumbnail item={item} />}
        resizeMode={'cover'}
        repeat={false}
        playInBackground={false}
        playWhenInactive={false}
        paused={pause}
      />
      {loading && (
        <ActivityIndicator color={Colors.themeColor} size={'large'} style={styles.playIcon} />
      )}
      <TouchableOpacity
        style={styles.playIcon}
        onPress={() => {
          if (isFocus) {
            playerRef.current?.getCurrentPosition().then((position) => {
              if (position === parseInt(String(playerState.duration), 10)) {
                playerRef.current?.seek(0)
              }
            })

            setPause(!pause)
          }
        }}
      >
        <MaterialIcon name={pause ? 'play' : 'pause'} color={Colors.themeColor} size={40} />
      </TouchableOpacity>

      <View style={styles.generalControls}>
        <View style={styles.raw}>
          <Text style={styles.time}>{toMMSS(playerState.current)}</Text>
          <Slider
            style={styles.sliderStyle}
            progress={progress}
            disable
            minimumValue={min}
            maximumValue={max}
            theme={{
              disableMinTrackTintColor: Colors.themeColor,
              maximumTrackTintColor: Colors.white,
              minimumTrackTintColor: Colors.themeColor
            }}
            renderBubble={() => {
              return null
            }}
          />
          <Text style={styles.time}>{toMMSS(playerState.duration)}</Text>
        </View>
      </View>
    </ScreenView>
  )
}

export default memo(VideoPlay)
const styles = StyleSheet.create({
  videoStyle: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.black
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: Colors.black37,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  generalControls: {
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.black37,
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
    zIndex: 2,
    bottom: 0
  },

  raw: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  time: {
    color: Colors.white,
    fontFamily: Fonts.ThemeRegular,
    fontSize: 14
  },
  sliderStyle: {
    height: scale(3),
    width: '100%',
    marginHorizontal: scale(4)
  }
})
const ScreenView = styled.View`
  width: ${W_WIDTH}px;
  height: ${S_HEIGHT}px;
`
