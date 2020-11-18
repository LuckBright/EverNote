// import config from '@/store/config'
function setCookie (name, value) {
  let argv = arguments
  let argc = arguments.length
  let expiresDay = (argc > 2) ? argv[2] : null
  let path = (argc > 3) ? argv[3] : '/'
  let domain = (argc > 4) ? argv[4] : null
  let secure = (argc > 5) ? argv[5] : false
  let expires = ''
  if (expiresDay) {
    let exp = new Date()
    exp.setTime(exp.getTime() + expiresDay * 24 * 60 * 60 * 1000)
    let theDate = new Date(exp)
    let expiresTime = new Date(theDate.toLocaleDateString())
    expires = '; expires=' + expiresTime
  }
  document.cookie = name + '=' + escape(value) + expires +
    ((path === null) ? '' : ('; path=' + path)) +
    ((domain === null) ? '' : ('; domain=' + domain)) +
    ((secure === true) ? '; secure' : '')
}

function getCookie (name) {
  let arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
  if (arr !== null) return unescape(arr[2])
  return null
}

function removeCookie (name) {
  setCookie(name, '', -1)
}

function setLocalStorage (key, value, time) {
  const localStorage = window.localStorage
  if (localStorage) {
    localStorage.setItem(key, value)
  } else {
    setCookie(key, value, time)
  }
}

function getLocalStorage (key) {
  const localStorage = window.localStorage
  if (localStorage) {
    return localStorage.getItem(key)
  } else {
    return getCookie(key)
  }
}

function removeLocalStorage (key) {
  const localStorage = window.localStorage
  if (localStorage) {
    localStorage.removeItem(key)
  } else {
    setCookie(key, '', -1)
  }
}

function setSessionStorage (key, value, time) {
  const sessionStorage = window.sessionStorage
  if (sessionStorage) {
    sessionStorage.setItem(key, value)
  } else {
    setCookie(key, value, time)
  }
}

function getSessionStorage (key) {
  const sessionStorage = window.sessionStorage
  if (sessionStorage) {
    return sessionStorage.getItem(key)
  } else {
    return getCookie(key)
  }
}

function removeSessionStorage (key) {
  const sessionStorage = window.sessionStorage
  if (sessionStorage) {
    sessionStorage.removeItem(key)
  } else {
    setCookie(key, '', -1)
  }
}

function setStorageByClinic (key, value, time) {
  setLocalStorage(key, value, time)
  // switch (config.clinic) {
  //   case 'gxkf':
  //     setCookie(key, value)
  //     break
  //   case 'xht':
  //     setLocalStorage(key, value, time)
  //     break
  //   case 'default':
  //     setCookie(key, value)
  //     break
  //   default:
  //     setCookie(key, value)
  // }
}

function getStorageByClinic (key) {
  let storage
  // 其他项目（租户中心，全局药品 可以通过这个参数来获取，来控制是否自动登录）
  // process.env.entry === 'tenantcenter'
  // switch (config.clinic) {
  //   case 'gxkf':
  //     storage = getCookie(key)
  //     break
  //   case 'xht':
  //     storage = getLocalStorage(key)
  //     break
  //   case 'default':
  //     storage = getCookie(key)
  //     break
  //   default:
  //     storage = getCookie(key)
  // }
  storage = getLocalStorage(key)
  return storage
}

function removeStorageByClinic (key) {
  removeLocalStorage(key)
  // switch (config.clinic) {
  //   case 'gxkf':
  //     removeCookie(key)
  //     break
  //   case 'xht':
  //     removeLocalStorage(key)
  //     break
  //   case 'default':
  //     removeCookie(key)
  //     break
  //   default:
  //     removeCookie(key)
  // }
}
function getUserIdFromStore () {
  if (this.getStorageByClinic('TOKEN')) {
    return this.$store.state.currentUser.userId
  } else {
    return null
  }
}

function getSysTypeText (code, val, type) {
  if (!window.sessionStorage.getItem(code) || !val) {
    return ''
  } else {
    let out = JSON.parse(window.sessionStorage.getItem(code), true).options.filter(v => {
      return v.id.toString() === val.toString() || v.value && v.value.toString() === val.toString()
    })[0]
    return out ? !type ? out.name : out[type] : ''
  }
}

export default {
  setCookie,
  getCookie,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  setStorageByClinic,
  getStorageByClinic,
  removeStorageByClinic,
  getUserIdFromStore,
  getSysTypeText,
  removeCookie
}
