import {useCallback, useContext} from 'react'
import EventSource from 'react-native-sse'
import {toast} from '@backpackapp-io/react-native-toast'
import {CommonActions} from '@react-navigation/native'
import _ from 'lodash'

import {MediaContext} from '@/Components/MediaProvider'
import Config from '@/Config'
import {SystemInfo} from '@/Modules/useSystemUpdate'
import {navigationRef} from '@/Routes/RootNavigation'
import {Constants, Images, Screens, Storage} from '@/Theme'

export default () => {
  const {posts, addPost, removePosts, clearData} = useContext(MediaContext)
  const start = useCallback(() => {
    const {ANDROID_ID} = SystemInfo
    const auth_token = Storage.getString(Constants.asyncStorageKeys.Token)
    const body = JSON.stringify({
      device_id: ANDROID_ID,
      auth_token
    })

    const es = new EventSource<any>(
      `${Config.baseURL}/frame/v3/updates`,

      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'user-agent': 'ABC'
        },
        body,
        method: 'POST'
      }
    )

    es.addEventListener('CONNECTED', (event) => {
      if (event.data) {
        const data = JSON.parse(event.data)
        if (data?.connection?.is_connected) {
          if (JSON.parse(event.data)?.media?.length > 0) {
            addPost(JSON.parse(event.data)?.media as MediaType[])
          }
          const user = data?.connection?.user
          Storage.setStorageData(Constants.asyncStorageKeys.userData, user)
          Constants.commonConstant.appUser = user

          navigationRef.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: Screens.HomeScreen
                }
              ]
            })
          )
          toast.success(
            'Your frame has connected successfully. Please enjoy your digital photo frame',
            'Frame Connected',
            {
              duration: 5000,
              image: Images.toast
            }
          )
        }
      }
    })

    es.addEventListener('NEW_APP_BUILD', (event) => {
      if (event.data) {
        console.log('NEW_APP_BUILD', JSON.parse(event.data))
      }

      toast.success(
        'New Version available to download. Please enjoy your digital photo frame',
        'NEW_APP_BUILD',
        {
          duration: 5000,
          image: Images.toast
        }
      )
    })

    es.addEventListener('MEDIA_UPLOADED', (event) => {
      if (event.data) {
        if (__DEV__) {
          toast.success('New media uploaded', 'MEDIA_UPLOADED', {
            duration: 5000,
            image: Images.toast
          })
        }

        addPost(JSON.parse(event.data) as MediaType[])
      }
    })

    es.addEventListener('MEDIA_REMOVED', (event) => {
      if (event.data) {
        if (__DEV__) {
          toast.success('media removed', 'MEDIA_REMOVED', {
            duration: 5000,
            image: Images.toast
          })
        }
        removePosts(JSON.parse(event.data))
      }
    })

    es.addEventListener('PONG', (event) => {
      if (event.data) {
        if (__DEV__) {
          toast.success('app initialized', 'PONG', {
            duration: 5000,
            image: Images.toast
          })
        }

        const app_build = JSON.parse(event.data)?.app_build

        if (app_build) {
          Storage.set(Constants.asyncStorageKeys.app_build, JSON.stringify(app_build))
        }

        // PONG
      }
    })

    es.addEventListener('DISCONNECTED', () => {
      toast.success('Frame disconnected', 'DISCONNECTED', {
        duration: 5000,
        image: Images.toast
      })
      es.close()
      es.removeAllEventListeners()
      clearData()
      Storage.clearAll()
      _.map(Storage.getAllKeys(), (key) => {
        if (key === 'Token') {
          return
        }
        if (key === 'OTP') {
          return
        }

        Storage.delete(key)
      })
      navigationRef.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: Screens.OnBoardScreen
            }
          ]
        })
      )
    })

    es.addEventListener('error', (error) => {
      if (__DEV__) {
        toast.error('Error Occured', 'error', {
          duration: 5000,
          image: Images.toast
        })
      }

      if (JSON.parse(JSON.stringify(error))?.xhrStatus === 401) {
        es.close()
        es.removeAllEventListeners()
        clearData()
        Storage.clearAll()
        _.map(Storage.getAllKeys(), (key) => {
          if (key === 'Token') {
            return
          }
          if (key === 'deviceId') {
            return
          }
          if (key === 'OTP') {
            return
          }

          Storage.delete(key)
        })
        navigationRef.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: Screens.OnBoardScreen
              }
            ]
          })
        )
      }
    })

    es.addEventListener('close', () => {
      if (__DEV__) {
        toast.error('connection Closed', 'close', {
          duration: 5000,
          image: Images.toast
        })
      }
    })
  }, [addPost, clearData, removePosts])

  return {
    posts,
    start
  }
}
