import { ElMessage } from 'element-plus'

export const handleChangeRequestHeader = config => {
  config['xxxx'] = 'xxx'
  return config
}

export const handleConfigureAuth = config => {
  config.headers['token'] = localStorage.getItem('token') || ''
  return config
}

export const handleNetworkError = errStatus => {
  const networkErrMap = {
    400: '错误的请求', // token 失效
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求错误，未找到该资源',
    405: '请求方法未允许',
    408: '请求超时',
    500: '服务器端出错',
    501: '网络未实现',
    502: '网络错误',
    503: '服务不可用',
    504: '网络超时',
    505: 'http版本不支持该请求'
  }
  if (errStatus) {
    ElMessage.error(networkErrMap[errStatus] ?? `其他连接错误 --${errStatus}`)
    return
  }

  ElMessage.error('无法连接到服务器！')
}

export const handleAuthError = errno => {
  // 根据后台项目匹配相应的状态码
  const authErrMap = {
    10031: '登录失效，需要重新登录',
    10032: '您太久没登录，请重新登录~',
    10033: '账户未绑定角色，请联系管理员绑定角色',
    10034: '该用户未注册，请联系管理员注册用户',
    10035: 'code 无法获取对应第三方平台用户',
    10036: '该账户未关联员工，请联系管理员做关联',
    10037: '账号已无效',
    10038: '账号未找到'
  }

  if (authErrMap.hasOwnProperty(errno)) {
    ElMessage.error(authErrMap[errno])
    // 授权错误，登出账户
    // logout();
    return false
  }

  return true
}

export const handleGeneralError = (errno, errmsg) => {
  if (errno !== '0') {
    ElMessage.error(errmsg)
    return false
  }

  return true
}

export const handleDownloadFile = response => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = function () {
      try {
        const jsonData = JSON.parse(this.result)
        if (jsonData?.code !== 200) {
          ElMessage.error(jsonData?.message ?? '请求失败')
          reject(jsonData)
        }
      } catch (err) {
        // 解析成对象失败，说明是正常的文件流
        const blob = new Blob([response.data])
        // 本地保存文件
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        const filename = response?.headers?.['content-disposition']?.split('filename*=')?.[1]?.substr(7)
        link.setAttribute('download', decodeURI(filename))
        document.body.appendChild(link)
        link.click()
        resolve(response.data)
      }
    }
    fileReader.readAsText(response.data)
  })
}
