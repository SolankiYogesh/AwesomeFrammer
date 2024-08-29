export default class ConnectionController {
  static ref: {show: () => void} | null = null

  static setRef(ref: {show: () => void} | null) {
    ConnectionController.ref = ref
  }

  static show() {
    if (ConnectionController.ref) {
      ConnectionController.ref.show()
    }
  }
}
