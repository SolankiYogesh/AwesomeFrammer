interface AppLoaderRefType {
  showLoader: (state: boolean) => void
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RootStackParamList = {
  WifiConnectScreen: {
    from: any
  }
  FrameConnectScreen: undefined
  HomeScreen:
    | undefined
    | {
        initialIndex?: number
      }
  SettingScreen:
    | undefined
    | {
        initialIndex?: number
      }
  GalleryScreen: undefined
  SleepScreen: undefined
}
declare module 'react-native-image-base64'
type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>
