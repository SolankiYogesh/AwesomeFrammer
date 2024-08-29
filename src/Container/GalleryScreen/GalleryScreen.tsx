import React, {useCallback, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {FlatList, StyleSheet, Text, View} from 'react-native'

import {Colors, Screens} from '../../Theme'
import GalleryItem from './Components/GalleryItem'
import AppHeader from '@/Components/AppHeader'
import {useDeviceOrientation, useMedia, useNavigation} from '@/Hooks'

const numColumns = 3
const gap = 10

export default () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {posts} = useMedia()
  const {heightPx, W_WIDTH, widthPx} = useDeviceOrientation()
  const itemSize = useMemo(() => {
    const screenWidth = W_WIDTH - 20

    const availableSpace = screenWidth - (numColumns - 1) * gap
    return availableSpace / numColumns
  }, [W_WIDTH])

  const onPressItem = useCallback(
    (initialIndex: number) => {
      navigation.navigate(Screens.HomeScreen, {
        initialIndex
      })
    },
    [navigation]
  )

  const renderItem = useCallback(
    ({item, index}: {item: MediaType; index: number}) => {
      return (
        <GalleryItem
          key={item.id}
          width={itemSize}
          item={item}
          onPress={() => onPressItem(index)}
        />
      )
    },
    [itemSize, onPressItem]
  )

  const renderEmpty = useMemo(() => {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            width: widthPx(100),
            height: heightPx(100)
          }
        ]}
      >
        <Text>{'No data found!'}</Text>
      </View>
    )
  }, [heightPx, widthPx])

  return (
    <View style={styles.mainContainer}>
      <AppHeader title={t('S24')} />
      <FlatList
        contentContainerStyle={styles.listStyle}
        data={posts}
        keyExtractor={(item: MediaType) => item?.id}
        renderItem={renderItem}
        columnWrapperStyle={{gap}}
        ListEmptyComponent={() => renderEmpty}
        numColumns={numColumns}
        key={numColumns}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.white
  },

  listStyle: {
    padding: 10
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
