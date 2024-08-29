import {MMKV} from 'react-native-mmkv'

const Storage = new MMKV()
const setStorageData = (keyName: string, dataArray: any) => {
  Storage.set(keyName, JSON.stringify(dataArray))
}

const getStorageData = (keyName: string) => {
  const data = Storage.getString(keyName)
  try {
    if (data) {
      return JSON.parse(data)
    } else {
      return null
    }
  } catch (_) {
    return null
  }
}

export default {
  set: Storage.set.bind(Storage),
  getNumber: Storage.getNumber.bind(Storage),
  getBoolean: Storage.getBoolean.bind(Storage),
  getString: Storage.getString.bind(Storage),
  clearAll: Storage.clearAll.bind(Storage),
  delete: Storage.delete.bind(Storage),
  getAllKeys: Storage.getAllKeys.bind(Storage),
  setStorageData,
  getStorageData
}
