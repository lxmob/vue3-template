import Axios from 'axios'
import {
  handleConfigureAuth,
  handleChangeRequestHeader,
  handleAuthError,
  handleGeneralError,
  handleNetworkError,
  handleDownloadFile
} from './request-tools'

const client = Axios.create({
  // 配置项
  baseURL: 'http://192.168.129.130:8081',
  timeout: 100000
})

// 请求拦截器
client.interceptors.request.use(config => {
  let preConfig
  preConfig = handleChangeRequestHeader(config)
  preConfig = handleConfigureAuth(preConfig)
  return preConfig
})

// 响应拦截器
client.interceptors.response.use(
  response => {
    if (response.status !== 200) return Promise.reject(response.data)
    handleAuthError(response.data.errno)
    handleGeneralError(response.data.errno, response.data.errmsg)
    if (response.data instanceof Blob) {
      return handleDownloadFile(response)
    }
    return response
  },
  err => {
    handleNetworkError(err.response.status)
    Promise.reject(err.response)
  }
)

export async function request(url, config) {
  const response = await client.request({ url, ...config })
  const result = response.data
  return [null, result]
}

export const get = (url, params = {}, clearFn) =>
  new Promise(resolve => {
    client
      .get(url, { params })
      .then(result => {
        let res
        if (clearFn !== undefined) {
          res = clearFn(result.data)
        } else {
          res = result.data
        }
        resolve([null, res])
      })
      .catch(err => {
        resolve([err, undefined])
      })
  })

export const post = (url, data, params = {}) => {
  return new Promise(resolve => {
    client
      .post(url, data, { params })
      .then(result => {
        resolve([null, result.data])
      })
      .catch(err => {
        resolve([err, undefined])
      })
  })
}

export default client
