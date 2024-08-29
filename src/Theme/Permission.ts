import {PermissionsAndroid} from 'react-native'

const getLocationPermission = () => {
  return new Promise((resolve) => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: 'Location permission is required for WiFi connections',
      message:
        'This app needs location permission as this is required  ' + 'to scan for wifi networks.',
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW'
    }).then((granted) => {
      resolve(granted === PermissionsAndroid.RESULTS.GRANTED)
    })
  })
}

const Permission = {
  getLocationPermission
}

export default Permission
