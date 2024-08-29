import React, {useEffect} from 'react'

import {AppLoader, ConnectionController, Loader, NetInfoSnackbar} from '../Components'
import AppNavigation from '../Routes/AppNavigation'
import constants from '../Theme/Constants'
import KIOSK from '@/Modules/KIOSKMode'
import {SystemInfo} from '@/Modules/useSystemUpdate'
import {Storage} from '@/Theme'

export default () => {
  useEffect(() => {
    const getUserData = async () => {
      const userData = Storage.getStorageData(constants.asyncStorageKeys.userData)
      if (userData) {
        constants.commonConstant.appUser = userData
      }
    }
    getUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // this method is native method and used to enble or disable kiosk mode if you want to debug in real device then do comment this method
    if (SystemInfo.isTablet) {
      KIOSK?.init()
    }
  }, [])

  return (
    <React.Fragment>
      <AppNavigation />
      <AppLoader ref={(e) => Loader.setLoader(e)} />
      <NetInfoSnackbar ref={(ref) => ConnectionController.setRef(ref as any)} />
    </React.Fragment>
  )
}
