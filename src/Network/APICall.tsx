/* eslint-disable no-console */
import {ToastAndroid} from 'react-native'
import Axios, {type AxiosError, AxiosRequestConfig} from 'axios'

import APIConfig from '../Config'
import constants from '../Theme/Constants'
import i18n from '@/i18n/i18n'

type methodtype = 'post' | 'get' | 'put' | 'delete' | 'patch'

const axiosInstance = Axios.create({
  baseURL: APIConfig.baseURL
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const {appUser}: any = constants.commonConstant
    if (appUser?.data?.access_token) {
      config.headers.Authorization = `Bearer ${appUser?.data?.access_token}`
      config.headers['user-agent'] = '0'
    }
    console.log(`axios request :=>`, config)
    return config
  },
  async (error) => {
    console.log('axios request error =>', error?.response || error)
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`axios response: <=`, response)
    return response
  },
  (error: AxiosError) => {
    console.log('axios response error =>', error?.response || error)
    if (error?.status === 500 || error?.code === 'ERR_NETWORK' || error?.code === 'ECONNABORTED') {
      return Promise.reject(error)
    }
    const {data, status}: any = error.response

    if (typeof data?.detail === 'string') {
      switch (status) {
        case 400:
        case 401:
        case 422:
        case 403:
          ToastAndroid.show(data?.detail, ToastAndroid.SHORT)
          break
        case 404:
          ToastAndroid.show(`${i18n.t('S32')}`, ToastAndroid.SHORT)
          break
        case 500:
          ToastAndroid.show(`${i18n.t('S32')}`, ToastAndroid.SHORT)
          break
      }
    }

    return Promise.reject(error)
  }
)

const getFormData = (object: any) => {
  const formData = new FormData()
  Object.keys(object).forEach((key) => {
    formData.append(key, object[key])
  })
  return formData
}

const APICall = async (
  method: methodtype = 'post',
  body: any,
  url = '',
  headers = {},
  formData = false
) => {
  const apiMethod = method.toLowerCase()
  const config: AxiosRequestConfig = {
    method: apiMethod,
    timeout: 1000 * 60 * 2
  }

  if (url) {
    config.url = url
    config.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  if (body && apiMethod === 'get') {
    config.params = body
  } else if (body && apiMethod === 'post' && !formData) {
    config.data = body
  } else if (body && apiMethod === 'patch' && !formData) {
    config.data = body
  } else if (body && apiMethod === 'post' && formData) {
    headers = {...headers, 'Content-Type': 'multipart/form-data'}
    config.data = getFormData(body)
  } else {
    config.data = body
  }
  if (Object.keys(headers).length > 0) {
    config.headers = {...config.headers, ...headers}
  }

  return new Promise((resolve, reject) => {
    axiosInstance(config)
      .then((res) => {
        resolve({statusCode: res.status, data: res.data})
      })
      .catch((error) => {
        if (error.response) {
          resolve({statusCode: error.response.status, data: error.response.data})
        }
        resolve({statusCode: 500, data: 'Something went to wrong!'})
      })
  })
}

export default APICall
