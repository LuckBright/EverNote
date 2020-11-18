function setCookie (cName, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = cName + '=' + escape(value) + ((expiredays === null) ? '' : ';expires=' + exdate.toGMTString())
}

function getCookie (cName) {
  if (document.cookie.length > 0) {
    var cookieObj = {}
    var cookieArr = document.cookie.split('; ')
    cookieArr.map(item => {
      let cookieItem = item.split('=')
      cookieObj[cookieItem[0]] = cookieItem[1]
    })
    return unescape(cookieObj[cName])
  }
  return ''
}

export default {
  setCookie,
  getCookie
}
